import { computed } from 'mobx';
import { useMemo } from 'react';
import { AENode } from 'src/store/agentEditor.types';
import { AgentWorkflowNode } from 'src/store/agents.types';
import { useStore } from 'src/store/useStore';
import { capitalize } from 'src/utils/strings';

export const useAgentEditorNodeFormattedDetails = (
	node: AgentWorkflowNode | undefined
) => {
	const formattedTitle = useMemo(() => {
		let rawTitle = node?.nodeName ?? 'Unnamed node';
		let title = rawTitle.replaceAll('_', ' ');
		return capitalize(title.trim());
	}, [node?.nodeName]);

	const formattedDescription = useMemo(() => {
		let desc = node?.nodeEnterCondition ?? '';
		let summary =
			desc.split('user')[1]?.split(', call this')[0] ||
			'Lacks description';
		return capitalize(summary.trim(), true);
	}, [node?.nodeEnterCondition]);

	return useMemo(
		() => ({ formattedTitle, formattedDescription }),
		[formattedTitle, formattedDescription]
	);
};

export const useRenderedNode = (
	nodeId: string | undefined
): AENode | undefined => {
	const store = useStore();

	const renderedNode = computed(() =>
		store.agentEditor.nodes.find((n) => {
			return n.id === nodeId;
		})
	).get();

	return renderedNode;
};

export const useNodeDetails = (
	nodeId: string | undefined
): AgentWorkflowNode | undefined => {
	const store = useStore();

	const nodeDetails = computed(() =>
		nodeId ? store.agentEditor.nodeDetails.get(nodeId) : undefined
	).get();

	return nodeDetails;
};

export const useGlobalNodes = (agentId: string | undefined) => {
	const store = useStore();

	let agent = agentId ? store.agents.byId.get(agentId) : undefined;

	const nodeIds = useMemo(() => {
		return agent?.workflow.nodes
			.filter((n) => n.nodeType == 'global')
			?.map((n) => n.id);
	}, [agent]);

	return nodeIds;
};
