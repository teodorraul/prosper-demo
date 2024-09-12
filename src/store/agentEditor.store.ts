import deepEqual from 'deep-equal';
import { action, observable, reaction } from 'mobx';

import Dagre from '@dagrejs/dagre';
import { EdgeChange, NodeChange, NodeDimensionChange, Viewport } from '@xyflow/react';

import { AEEdge, AENode } from './agentEditor.types';
import { Agent } from './agents.types';
import Store from './root.store';

type MountStatus =
	| {
			status: "mounted";
			forAgentId: number;
	  }
	| { status: "mounting" }
	| { status: "failedToMount" };

type EditorAction = {
	type: "select";
	nodeId: string | undefined;
};
export class AgentEditorStore {
	@observable accessor status: MountStatus | undefined = undefined;
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

	mountWithAgentId = (agentId: number) => {
		if (
			this.status?.status == "mounted" &&
			this.status?.forAgentId == agentId
		) {
			return;
		}

		let agent = Store.agents.byId.get(agentId);

		if (agent) {
			this.buildStateFrom(agent);

			reaction(
				() => agent,
				(agent) => {
					this.buildStateFrom(agent);
				}
			);

			this.setMountStatus({ status: "mounted", forAgentId: agentId });
		} else {
			this.setMountStatus({ status: "failedToMount" });
		}
	};

	buildStateFrom = async (agent: Agent) => {
		let unlayoutedEdges = [
			...agent.workflow.edges.map((e) => {
				let node: AEEdge = {
					id: `${e.id}`,
					type: "edge",
					data: {},
					source: `${e.source}`,
					target: `${e.target}`,
				};
				return node;
			}),
		];

		let unlayoutedNodes: AENode[] = [
			// We exclude the global nodes, since we handle them as rows...
			...agent.workflow.nodes
				.filter((n) => n.nodeType != "global")
				.map((n) => {
					let node: AENode = {
						id: `${n.id}`,
						type: "node",
						position: {
							x: 0,
							y: 0,
						},
						data: {},
					};
					return node;
				}),
		];

		const { layoutedEdges, layoutedNodes } = this.layoutTree(
			unlayoutedNodes,
			unlayoutedEdges
		);

		this.setNodesAndEdges(layoutedNodes, layoutedEdges);
	};

	relayoutNodes = async () => {
		console.log("Relayouting nodes");
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
			rankdir: "TB",
			align: "UL",
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
				case "add":
					break;
				case "dimensions":
					if (change.dimensions) {
						dimensionChanges.push(change);
					}
					break;
				case "remove":
					break;
				case "replace":
					break;
				case "position":
					break;
				case "select":
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
	setMountStatus(status: MountStatus) {
		this.status = status;
	}

	@action.bound
	selectNode(id: string | undefined, from: ActionSource = "default") {
		if (from == "default" || from == "redo") {
			this.undoStack.push({
				type: "select",
				nodeId: this.selectedNode,
			});
			if (from == "default") {
				this.redoStack = [];
			}
		}

		if (from == "undo") {
			this.redoStack.push({
				type: "select",
				nodeId: this.selectedNode,
			});
		}

		this.selectedNode = id;
	}

	executeAction = (action: EditorAction | undefined, from: ActionSource) => {
		switch (action?.type) {
			case "select":
				this.selectNode(action.nodeId, from);
		}
	};

	undo = () => {
		const lastAction = this.undoStack.pop();
		this.executeAction(lastAction, "undo");
	};

	redo = () => {
		const lastAction = this.redoStack.pop();
		this.executeAction(lastAction, "redo");
	};

	@action.bound
	handleViewportChange(viewport: Viewport) {
		if (!deepEqual(this.viewport, viewport)) {
			this.viewport = viewport;
		}
	}
}

type ActionSource = "default" | "undo" | "redo";
