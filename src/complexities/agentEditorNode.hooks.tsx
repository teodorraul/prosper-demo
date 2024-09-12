import { useMemo } from 'react';
import { AgentWorkflowNode } from 'src/store/agents.types';
import { useStore } from 'src/store/useStore';
import { capitalize } from 'src/utils/strings';

export const useAgentEditorNodeFormattedDetails = (
	node: AgentWorkflowNode | undefined
) => {
	const formattedTitle = useMemo(() => {
		let rawTitle = node?.nodeName ?? "Unnamed node";
		let title = rawTitle.replaceAll("_", " ");
		return capitalize(title.trim());
	}, [node?.nodeName]);

	const formattedDescription = useMemo(() => {
		let desc = node?.nodeEnterCondition ?? "";
		let summary =
			desc.split("user")[1]?.split(", call this")[0] ||
			"Lacks description";
		return capitalize(summary.trim(), true);
	}, [node?.nodeEnterCondition]);

	return useMemo(
		() => ({ formattedTitle, formattedDescription }),
		[formattedTitle, formattedDescription]
	);
};

export const useNode = (
	agentId: string | undefined,
	nodeId: string | undefined
) => {
	const store = useStore();

	let agent = agentId ? store.agents.byId.get(parseInt(agentId)) : undefined;

	const node = useMemo(() => {
		if (nodeId) {
			return agent?.workflow.nodes.find((n) => n.id == parseInt(nodeId));
		}
	}, [agent, nodeId]);

	return node;
};

export const useGlobalNodes = (agentId: string | undefined) => {
	const store = useStore();

	let agent = agentId ? store.agents.byId.get(parseInt(agentId)) : undefined;

	const nodeIds = useMemo(() => {
		return agent?.workflow.nodes
			.filter((n) => n.nodeType == "global")
			?.map((n) => n.id);
	}, [agent]);

	return nodeIds;
};
