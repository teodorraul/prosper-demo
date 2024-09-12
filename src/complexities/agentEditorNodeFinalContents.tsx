import { Text } from 'src/components/text';

import { useAgentEditorNodeFormattedDetails, useNode } from './agentEditorNode.hooks';

export const AgentEditorNodeFinalContents: React.FC<{
	agentId: string;
	nodeId: string;
}> = ({ agentId, nodeId }) => {
	const node = useNode(agentId, nodeId);
	const { formattedTitle, formattedDescription } =
		useAgentEditorNodeFormattedDetails(node);

	return (
		<div>
			<Text level="title" ctx="node">
				{formattedTitle}
			</Text>
			<Text level="body" ctx="node">
				{formattedDescription}
			</Text>
		</div>
	);
};
