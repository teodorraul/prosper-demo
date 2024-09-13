import { ObservableMap } from 'mobx';

import { AEEdge } from './agentEditor.types';
import { AgentWorkflowNode } from './agents.types';

export const getChildrenNodeIds = (forNodeId: string, edges: AEEdge[]) => {
	let allNodes = [];

	for (const edge of edges) {
		if (edge.source == forNodeId) {
			allNodes.push(edge.target);
		}
	}

	return allNodes;
};

export const getNodesParentId = (forNodeId: string, edges: AEEdge[]) => {
	for (const edge of edges) {
		if (edge.target == forNodeId) {
			return edge.source;
		}
	}

	return undefined;
};

export const getNextPositions = (
	nodes: ObservableMap<string, AgentWorkflowNode>,
	childrenIds: string[]
) => {
	const filteredNodes = childrenIds
		.map((id) => nodes.get(id))
		.filter((node) => node !== undefined) as AgentWorkflowNode[];

	if (filteredNodes.length === 0) {
		return { min: 0, max: 0 };
	}

	const orders = filteredNodes.map((node) => node.order);
	const minOrder = Math.min(...orders);
	const maxOrder = Math.max(...orders);

	return { min: minOrder, max: maxOrder };
};
