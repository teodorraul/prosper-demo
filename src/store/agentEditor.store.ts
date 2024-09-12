import deepEqual from 'deep-equal';
import { action, IObservableArray, observable, reaction, toJS } from 'mobx';
import { v4 as uuid } from 'uuid';

import Dagre from '@dagrejs/dagre';
import { EdgeChange, NodeChange, NodeDimensionChange, Viewport } from '@xyflow/react';

import { AEEdge, AENode } from './agentEditor.types';
import { Agent, AgentWorkflowNode, RemoteAgentEditorNode } from './agents.types';
import Store from './root.store';

type MountStatus =
	| {
			status: 'mounted';
			forAgentId: string;
	  }
	| { status: 'mounting' }
	| { status: 'failedToMount' };

type EditorAction =
	| {
			type: 'select';
			nodeId: string | undefined;
	  }
	| {
			type: 'insert-node';
			nodeId: string | undefined;
			side: 'right' | 'left';
	  }
	| {
			type: 'remove-node';
			nodeId: string | undefined;
			side: 'right' | 'left';
	  };

type HoveredNode = {
	id: string;
	side: 'left' | 'right';
};

type SyncOperation = {
	operation: 'upsert-node';
	node: AgentWorkflowNode;
	id: string;
	parentId: string;
};

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

	mountWithAgentId = (agentId: string) => {
		if (
			this.status?.status == 'mounted' &&
			this.status?.forAgentId == agentId
		) {
			return;
		}

		let agent = Store.agents.byId.get(agentId);

		if (agent) {
			this.buildStateFrom(agent);

			reaction(
				() => toJS(Store.agents.byId),
				(agents) => {
					let agent = agents.get(agentId);
					if (agent) {
						this.buildStateFrom(agent);
					}
				}
			);

			reaction(
				() => this.syncQueue.slice(),
				(queue) => {
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

	getNodesAndEdgesFromOperations = () => {
		const opNodes: AENode[] = [];
		const opEdges: AEEdge[] = [];
		const nodeDetails: AgentWorkflowNode[] = [];

		for (const op of this.syncQueue) {
			switch (op.operation) {
				case 'upsert-node':
					opNodes.push({
						id: op.node.id,
						type: 'node',
						position: { x: 0, y: 0 },
						data: {},
					});
					let nodeBootstrap: RemoteAgentEditorNode = {
						id: op.node.id,
						node_enter_condition: '',
						node_name: '',
						node_type: 'default',
						prompt: '',
						is_global: false,
						user_data: [],
					};
					nodeDetails.push(new AgentWorkflowNode(nodeBootstrap));
					opEdges.push({
						id: op.node.id + '_edge',
						type: 'edge',
						source: op.parentId,
						target: op.node.id,
					});

					break;
			}
		}
		return { opNodes, opEdges, nodeDetails };
	};

	buildStateFrom = async (agent: Agent) => {
		const { opNodes, opEdges, nodeDetails } =
			this.getNodesAndEdgesFromOperations();

		this.nodeDetails.replace({});

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
			...opEdges,
		];

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
			...opNodes,
		];

		for (let node of agent.workflow.nodes) {
			this.nodeDetails.set(node.id, node);
		}
		for (let node of nodeDetails) {
			this.nodeDetails.set(node.id, node);
		}

		console.log(unlayoutedNodes, unlayoutedEdges);
		const { layoutedEdges, layoutedNodes } = this.layoutTree(
			unlayoutedNodes,
			unlayoutedEdges
		);

		this.setNodesAndEdges(layoutedNodes, layoutedEdges);
	};

	relayoutNodes = async () => {
		const { layoutedEdges, layoutedNodes } = this.layoutTree(
			this.nodes,
			this.edges
		);

		this.setNodesAndEdges(layoutedNodes, layoutedEdges);
	};

	layoutTree = (
		nodes: AENode[],
		edges: AEEdge[]
	): { layoutedNodes: AENode[]; layoutedEdges: AEEdge[] } => {
		const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
		g.setGraph({
			rankdir: 'TB',
			align: 'UL',
			ranksep: 120,
			nodesep: 80,
		});

		edges.forEach((edge) => g.setEdge(edge.source, edge.target));
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
			let y = position.y - (node.measured?.height ?? 0) / 2;
			if (minYByRank[rank] === undefined || y > minYByRank[rank]) {
				minYByRank[rank] = y;
			}
		});

		g.nodes().forEach(function (v) {
			let node = g.node(v) as any;
			node.y = minYByRank[node.rank];
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
						console.log(change);
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
					// if (change.selected) {
					// 	this.selectNode(change.id);
					// } else {
					// 	this.selectNode(undefined);
					// }
					break;
			}
		}

		if (dimensionChanges.length) {
			this.updateNodesDimensions(dimensionChanges);
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

	onEdgesChange = (changes: EdgeChange[]) => {
		// console.log("edges changed", changes);
	};

	@action.bound
	setNodesAndEdges(nodes: AENode[], edges: AEEdge[]) {
		this.nodes = nodes;
		this.edges = edges;
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
		if (from == 'default' || from == 'redo') {
			this.undoStack.push({
				type: 'select',
				nodeId: this.selectedNode,
			});
			if (from == 'default') {
				this.redoStack = [];
			}
		}

		if (from == 'undo') {
			this.redoStack.push({
				type: 'select',
				nodeId: this.selectedNode,
			});
		}

		this.selectedNode = id;
	}

	@action.bound
	insertNode(
		parentNodeId: string,
		side: 'left' | 'right',
		from: ActionSource = 'default'
	) {
		let nodeId = uuid();
		this.syncQueue.push({
			operation: 'upsert-node',
			id: uuid(),
			parentId: parentNodeId,
			node: new AgentWorkflowNode({
				id: nodeId,
				node_enter_condition: '',
				node_type: 'default',
				node_name: '',
				prompt: '',
				is_global: false,
				user_data: [],
			}),
		});
		this.selectNode(nodeId);

		// if (from == 'default' || from == 'redo') {
		// 	this.undoStack.push({
		// 		type: 'select',
		// 		nodeId: this.selectedNode,
		// 	});
		// 	if (from == 'default') {
		// 		this.redoStack = [];
		// 	}
		// }

		// if (from == 'undo') {
		// 	this.redoStack.push({
		// 		type: 'select',
		// 		nodeId: this.selectedNode,
		// 	});
		// }

		// this.selectedNode = id;

		// console.log(parentNodeId, side, from);
	}

	executeAction = (action: EditorAction | undefined, from: ActionSource) => {
		switch (action?.type) {
			case 'select':
				this.selectNode(action.nodeId, from);
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

	@action.bound
	handleViewportChange(viewport: Viewport) {
		if (!deepEqual(this.viewport, viewport)) {
			this.viewport = viewport;
		}
	}
}

type ActionSource = 'default' | 'undo' | 'redo';
