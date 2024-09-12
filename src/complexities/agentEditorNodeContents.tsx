import { NodeDataExtracts } from 'src/components/nodeDataExtracts';
import { NodeIf } from 'src/components/nodeIf';
import { Text } from 'src/components/text';
import { AgentWorkflowNode } from 'src/store/agents.types';

import { AEMContextGrid } from './agentEditorNode.css';
import { useAgentEditorNodeFormattedDetails, useNodeDetails } from './agentEditorNode.hooks';

export const AgentEditorNodeContents: React.FC<{
	nodeId: string;
	node: AgentWorkflowNode;
}> = ({ nodeId }) => {
	const nodeDetails = useNodeDetails(nodeId);
	const { formattedTitle, formattedDescription } =
		useAgentEditorNodeFormattedDetails(nodeDetails);
	return (
		<div className="node-container">
			<Text level="title" ctx="node">
				{formattedTitle}
			</Text>
			<div className={AEMContextGrid}>
				<NodeIf />
				<Text level="body" ctx="node">
					{formattedDescription}
				</Text>
			</div>
			<NodeDataExtracts items={nodeDetails?.userData} />
		</div>
	);
};
