import deepEqual from 'deep-equal';
import { action, IObservableArray, observable, reaction, toJS } from 'mobx';
import { v4 as uuid } from 'uuid';

import Dagre from '@dagrejs/dagre';
import {
	EdgeChange,
	NodeChange,
	NodeDimensionChange,
	Viewport,
} from '@xyflow/react';

import {
	ActionSource,
	AEEdge,
	AENode,
	EditorAction,
	HoveredNode,
	MountStatus,
	SyncOperation,
} from './agentEditor.types';
import { getNodesParentId } from './agentEditor.utils';
import {
	Agent,
	AgentWorkflowNode,
	RAENodePayload,
	RemoteAgentEditorNode,
} from './agents.types';
import Store from './root.store';

export class AgentEditorStore {
	@observable accessor status: MountStatus | undefined = undefined;
	@observable accessor nodeDetails = observable.map<
		string,
		AgentWorkflowNode
	>();
	@observable accessor nodes: AENode[] = [];
	@observable accessor edges: AEEdge[] = [];
	@observable accessor selectedNode: string | undefined = undefined;
	@observable accessor viewport: Viewport = {
		x: 0,
		y: 0,
		zoom: 1,
	};
	private undoStack: EditorAction[] = [];
	private redoStack: EditorAction[] = [];
	@observable accessor hoveredNode: HoveredNode | undefined = undefined;
	@observable accessor syncQueue: IObservableArray<SyncOperation> =
		observable.array(undefined, { deep: false });
	@observable accessor mountedAgentId: string | undefined = undefined;
	@observable accessor prompt: string | undefined = undefined;

	mountWithAgentId = (agentId: string) => {
		if (
			this.status?.status == 'mounted' &&
			this.status?.forAgentId == agentId
		) {
			return;
		}

		let agent = Store.agents.byId.get(agentId);
		this.mountedAgentId = agentId;

		if (agent) {
			this.buildStateFrom(agent);

			reaction(
				() => toJS(Store.agents.byId),
				() => {
					let agent = Store.agents.byId.get(agentId);
					if (agent) {
						this.buildStateFrom(agent);
					}
				}
			);

			reaction(
				() => this.syncQueue.slice(),
				async (queue) => {
					this.syncWithSupa(queue);

					let agent = Store.agents.byId.get(agentId);
					if (agent) {
						this.buildStateFrom(agent);
					}
				}
			);

			this.setMountStatus({ status: 'mounted', forAgentId: agentId });
		} else {
			this.setMountStatus({ status: 'failedToMount' });
		}
	};

	@observable accessor syncing = false;
	syncWithSupa = async (queue: SyncOperation[]) => {
		if (this.syncing) return;
		let agentId = this.mountedAgentId;
		if (!agentId) return;

		this.setSyncing(true);
		let promises = [];
		for (const op of queue) {
			promises.push(
				new Promise<{ error: string | undefined; id: string }>(
					async (res, rej) => {
						const { error } = await Store.agents.applyAgentOp(
							agentId,
							op,
							(op) => {
								let newOp = Store.agentEditor.syncQueue.find(
									(o) => o.id == op.id
								);
								return newOp !== op;
							}
						);
						if (!error) {
							res({ error: undefined, id: op.id });
							return;
						} else {
							res({ error: error, id: op.id });
							return;
						}
					}
				)
			);
		}

		try {
			let ops = await Promise.all(promises);
			let completedOps = [];
			for (const op of ops) {
				if (!op.error) {
					completedOps.push(op.id);
				}
			}

			this.removeCompletedOps(completedOps);

			this.setSyncing(false);
		} catch {
			this.setSyncing(false);
		}
	};

	@action.bound
	removeCompletedOps(completedOps: string[]) {
		for (const opId of completedOps) {
			let op = this.syncQueue.find((o) => o.id == opId);
			if (op) {
				this.syncQueue.remove(op);
			}
		}
	}

	@action.bound
	setSyncing(status: boolean) {
		this.syncing = status;
	}

	getOverrideFromOperations = () => {
		const opNodes: AENode[] = [];
		const removedNodesIds: string[] = [];
		const opEdges: AEEdge[] = [];
		const nodeDetails: AgentWorkflowNode[] = [];
		let pendingPrompt: string | undefined = undefined;

		for (const op of this.syncQueue) {
			switch (op.operation) {
				case 'update-prompt':
					pendingPrompt = op.prompt;
					break;
				case 'upsert-node':
					opNodes.push({
						id: op.nodeDetails.id,
						type: 'node',
						position: { x: 0, y: 0 },
						data: {},
					});

					let nodeBootstrap: RemoteAgentEditorNode = {
						id: op.nodeDetails.id,
						node_enter_condition:
							op.nodeDetails.nodeEnterCondition ?? '',
						node_name: op.nodeDetails.nodeName ?? '',
						node_type: op.nodeDetails.nodeType ?? '',
						prompt: op.nodeDetails.prompt ?? '',
						is_global: op.nodeDetails.isGlobal ?? false,
						order: op.nodeDetails.order ?? 1,
						user_data:
							op.nodeDetails.serializedUserDataForSupa ?? [],
					};
					nodeDetails.push(new AgentWorkflowNode(nodeBootstrap));

					if (op.parentId) {
						let edgeId = op.nodeDetails.id + '_edge';
						if (!opEdges.find((o) => o.id == edgeId)) {
							opEdges.push({
								id: edgeId,
								type: 'edge',
								source: op.parentId,
								target: op.nodeDetails.id,
							});
						}
					}

					break;
				case 'delete-node':
					removedNodesIds.push(op.id);
			}
		}
		return {
			opNodes,
			opEdges,
			nodeDetails,
			removedNodesIds,
			pendingPrompt,
		};
	};

	buildStateFrom = async (agent: Agent) => {
		const {
			opNodes,
			opEdges,
			nodeDetails,
			removedNodesIds,
			pendingPrompt,
		} = this.getOverrideFromOperations();

		this.nodeDetails.replace({});

		let unlayoutedNodes: AENode[] = [
			// We exclude the global nodes, since we handle them as rows...
			...agent.workflow.nodes
				.filter((n) => n.nodeType != 'global')
				.map((n) => {
					let node: AENode = {
						id: `${n.id}`,
						type: 'node',
						position: {
							x: 0,
							y: 0,
						},
						data: {},
					};
					return node;
				}),
		];

		let unlayoutedEdges = [
			...agent.workflow.edges.map((e) => {
				let node: AEEdge = {
					id: `${e.id}`,
					type: 'edge',
					data: {},
					source: `${e.source}`,
					target: `${e.target}`,
				};
				return node;
			}),
		];

		for (const n of opNodes) {
			unlayoutedNodes = unlayoutedNodes.filter((ue) => ue.id != n.id);
			unlayoutedNodes.push(n);
		}

		for (const e of opEdges) {
			unlayoutedEdges = unlayoutedEdges.filter((ue) => ue.id != e.id);
			unlayoutedEdges.push(e);
		}

		for (const id of removedNodesIds) {
			unlayoutedEdges = unlayoutedEdges.filter((e) => e.target != id);
			unlayoutedNodes = unlayoutedNodes.filter((e) => e.id != id);
		}

		for (let node of [...nodeDetails, ...agent.workflow.nodes]) {
			let existing = this.nodeDetails.get(node.id);
			if (!deepEqual(existing, node)) {
				this.nodeDetails.set(node.id, node);
			}
		}

		for (const node of unlayoutedNodes) {
			var needsEnding = true;
			for (const edge of unlayoutedEdges) {
				if (edge.source == node.id) {
					needsEnding = false;
				}
			}
			node.data.needsEnding = needsEnding;
		}

		const { layoutedEdges, layoutedNodes } = this.layoutTree(
			unlayoutedNodes,
			unlayoutedEdges
		);

		this.nodeCountForNodeId = {};
		for (const edge of layoutedEdges) {
			if (!this.nodeCountForNodeId[edge.source]) {
				this.nodeCountForNodeId[edge.source] = 0;
			}
			this.nodeCountForNodeId[edge.source]++;
		}

		this.setNodesAndEdges(layoutedNodes, layoutedEdges);

		this.prompt = pendingPrompt ?? agent.workflow.generalInstructions;
	};

	relayoutNodes = async () => {
		const { layoutedEdges, layoutedNodes } = this.layoutTree(
			this.nodes,
			this.edges
		);

		this.setNodesAndEdges(layoutedNodes, layoutedEdges);
	};

	nodeCountForNodeId: { [key: string]: number } = {};

	layoutTree = (
		nodes: AENode[],
		edges: AEEdge[]
	): { layoutedNodes: AENode[]; layoutedEdges: AEEdge[] } => {
		const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
		g.setGraph({
			rankdir: 'TB',
			align: 'UL',
			ranker: 'network-simplex',
			ranksep: 60,
			nodesep: 80,
		});

		edges.forEach((edge) => {
			let targetNode = this.nodeDetails.get(edge.target);
			g.setEdge(edge.source, edge.target, {
				weight: targetNode?.order,
			});
		});

		nodes.sort(
			(a, b) =>
				this.nodeDetails.get(a)?.order > this.nodeDetails.get(b)?.order
		);

		nodes.forEach((node) =>
			g.setNode(node.id, {
				...node,
				width: node.measured?.width ?? 0,
				height: node.measured?.height ?? 0,
			})
		);

		Dagre.layout(g);

		let minYByRank: any = {};

		nodes.map((node) => {
			const position = g.node(node.id);
			let rank = position.rank as any;

			let nd = this.nodeDetails.get(node.id);
			if (nd) {
				nd.rank = rank;
			}
			let y = position.y - (node.measured?.height ?? 0) / 2;
			if (minYByRank[rank] === undefined || y > minYByRank[rank]) {
				minYByRank[rank] = y;
			}
		});

		g.nodes().forEach(function (v) {
			let node = g.node(v) as any;
			if (node) {
				node.y = minYByRank[node.rank];
			}
		});

		return {
			layoutedNodes: nodes.map((node) => {
				const position = g.node(node.id);
				const x = position.x - (node.measured?.width ?? 0) / 2;
				const y = position.y;

				return { ...node, position: { x, y } };
			}),
			layoutedEdges: edges,
		};
	};

	onNodesChange = (changes: NodeChange[]) => {
		let dimensionChanges: NodeDimensionChange[] = [];

		for (const change of changes) {
			switch (change.type) {
				case 'add':
					break;
				case 'dimensions':
					if (change.dimensions) {
						dimensionChanges.push(change);
					}
					break;
				case 'remove':
					break;
				case 'replace':
					break;
				case 'position':
					break;
				case 'select':
					break;
			}
		}

		if (dimensionChanges.length) {
			this.updateNodesDimensions(dimensionChanges);
		}
	};

	duplicateSelectedNode = () => {
		if (this.selectedNode) {
			let parentId = getNodesParentId(this.selectedNode, this.edges);
			let selectedId = this.selectedNode;
			if (parentId) {
				let details = this.nodeDetails.get(selectedId);
				if (details?.nodeType != 'default') {
					return;
				}
				if (details) {
					this.insertNode(parentId, 'right', {
						...details?.serializedForSupa,
						order: this.getNextPosition(parentId, 'right'),
						id: uuid(),
					});
				}
			}
		}
	};

	@action.bound
	updateNodesDimensions(changes: NodeDimensionChange[]) {
		for (const change of changes) {
			this.nodes.forEach((n) => {
				if (n.id == change.id && change.dimensions) {
					n.measured = change.dimensions;
				}
			});
		}
		this.relayoutNodes();
	}

	onEdgesChange = (changes: EdgeChange[]) => {};

	@action.bound
	setNodesAndEdges(nodes: AENode[], edges: AEEdge[]) {
		if (!deepEqual(nodes, this.nodes)) {
			this.nodes = nodes;
		}
		if (!deepEqual(nodes, this.edges)) {
			this.edges = edges;
		}
	}

	@action.bound
	setHoveredNode(node?: HoveredNode) {
		this.hoveredNode = node;
	}

	@action.bound
	setMountStatus(status: MountStatus) {
		this.status = status;
	}

	@action.bound
	selectNode(id: string | undefined, from: ActionSource = 'default') {
		this.handleOpUndoRedo(from, {
			type: 'select',
			nodeId: this.selectedNode,
		});

		this.selectedNode = id;
	}

	getNextPosition = (
		parentNodeId: string,
		side?: 'left' | 'right' | 'center'
	) => {
		if (parentNodeId) {
			let dir = side == 'left' ? -1 : 1;
			return (
				((this.nodeCountForNodeId[parentNodeId] ?? 0) + 1) * 100 * dir
			);
		}
		return 0;
	};

	@action.bound
	insertNode(
		parentNodeId?: string,
		side?: 'left' | 'right' | 'center',
		withDetails?: RemoteAgentEditorNode,
		from: ActionSource = 'default'
	) {
		let nodeId = withDetails?.id ?? uuid();
		var nextPosition = withDetails?.order ?? 0;

		if (parentNodeId) {
			nextPosition = this.getNextPosition(parentNodeId, side);
		}

		this.handleOpUndoRedo(from, {
			type: 'remove-node',
			nodeId: nodeId,
		});

		let payload: RemoteAgentEditorNode = withDetails ?? {
			id: nodeId,
			node_enter_condition: '',
			node_type: side == 'center' ? 'end_call' : 'default',
			node_name: '',
			prompt: '',
			order: nextPosition,
			is_global: false,
			user_data: [],
		};

		this.syncQueue.push({
			operation: 'upsert-node',
			id: uuid(),
			parentId: parentNodeId,
			nodeDetails: new AgentWorkflowNode(payload),
		});
		console.log(payload);

		for (const q of this.syncQueue) {
			if (q.operation == 'delete-node' && q.id == nodeId) {
				this.syncQueue.remove(q);
			}
		}

		this.selectNode(nodeId, 'skip');
	}

	@action.bound
	updateNode(
		nodeId: string,
		delta?: Partial<RAENodePayload>,
		from: ActionSource = 'default'
	) {
		let existing = this.nodeDetails.get(nodeId);
		let parent = getNodesParentId(nodeId, this.edges);

		if (!existing) {
			console.error('node details existing is undefined');
			return;
		}

		this.handleOpUndoRedo(from, {
			type: 'update-node',
			nodeId: nodeId,
			details: existing.serializedForSupa,
		});

		let newNode = { ...existing.serializedForSupa, ...delta };

		this.syncQueue.push({
			operation: 'upsert-node',
			id: uuid(),
			parentId: parent,
			nodeDetails: new AgentWorkflowNode(newNode),
		});

		for (const q of this.syncQueue) {
			if (q.operation == 'delete-node' && q.id == nodeId) {
				this.syncQueue.remove(q);
			}
		}
	}

	@action.bound
	removeNode(nodeId: string, from: ActionSource = 'default') {
		let nodeDetails = this.nodeDetails.get(nodeId);
		const parentId = getNodesParentId(nodeId, this.edges);

		if (!nodeDetails) return;

		this.handleOpUndoRedo(from, {
			type: 'insert-node',
			nodeId: nodeId,
			parentId: parentId,
			details: nodeDetails?.serializedForSupa,
		});

		for (const q of this.syncQueue) {
			if (q.operation == 'upsert-node' && q.nodeDetails.id == nodeId) {
				this.syncQueue.remove(q);
			}
		}
		this.syncQueue.push({ operation: 'delete-node', id: nodeId });

		let parent = getNodesParentId(nodeId, this.edges);
		if (parent) {
			this.selectNode(parent, 'skip');
		}
	}

	handleOpUndoRedo = (from: ActionSource, reverseAction: EditorAction) => {
		if (from != 'skip') {
			if (from == 'default' || from == 'redo') {
				this.undoStack.push(reverseAction);
				if (from == 'default') {
					this.redoStack = [];
				}
			}
			if (from == 'undo') {
				this.redoStack.push(reverseAction);
			}
		}
	};

	@action.bound
	setPrompt(value: string | undefined) {
		this.prompt = value;
	}

	@action.bound
	notifyPromptUpdated(
		value: string | undefined,
		from: ActionSource = 'default'
	) {
		this.handleOpUndoRedo(from, {
			type: 'prompt-updated',
			value: this.prompt,
		});

		this.prompt = value;

		for (const q of this.syncQueue) {
			if (q.operation == 'update-prompt') {
				this.syncQueue.remove(q);
			}
		}
		this.syncQueue.push({
			operation: 'update-prompt',
			prompt: this.prompt,
			id: uuid(),
		});
	}

	executeAction = (action: EditorAction | undefined, from: ActionSource) => {
		switch (action?.type) {
			case 'select':
				this.selectNode(action.nodeId, from);
				return;
			case 'insert-node':
				this.insertNode(
					action.parentId,
					undefined,
					action.details,
					from
				);
				return;
			case 'prompt-updated':
				this.notifyPromptUpdated(action.value, from);
				return;
			case 'remove-node':
				this.removeNode(action.nodeId, from);
		}
	};

	undo = () => {
		const lastAction = this.undoStack.pop();
		this.executeAction(lastAction, 'undo');
	};

	redo = () => {
		const lastAction = this.redoStack.pop();
		this.executeAction(lastAction, 'redo');
	};

	debugStacks = () => {
		let undo = this.undoStack.map((n) => n.type + n.value).join('\n');
		let redo = this.redoStack.map((n) => n.type + n.value).join('\n');
		console.debug('UNDO:\n', undo);
		console.debug('REDO:\n', redo);
		console.debug('---');
	};

	@action.bound
	handleViewportChange(viewport: Viewport) {
		if (!deepEqual(this.viewport, viewport)) {
			this.viewport = viewport;
		}
	}
}
