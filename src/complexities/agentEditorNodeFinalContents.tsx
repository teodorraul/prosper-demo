import { Text } from 'src/components/text';

import { useAgentEditorNodeFormattedDetails, useNodeDetails } from './agentEditorNode.hooks';

export const AgentEditorNodeFinalContents: React.FC<{
	nodeId: string;
}> = ({ nodeId }) => {
	const details = useNodeDetails(nodeId);
	const { formattedTitle, formattedDescription } =
		useAgentEditorNodeFormattedDetails(details);

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
