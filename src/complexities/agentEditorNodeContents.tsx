import { NodeDataExtracts } from 'src/components/nodeDataExtracts';
import { NodeIf } from 'src/components/nodeIf';
import { Text } from 'src/components/text';
import { AgentWorkflowNode } from 'src/store/agents.types';

import { AEMContextGrid } from './agentEditorNode.css';
import { useAgentEditorNodeFormattedDetails, useNode } from './agentEditorNode.hooks';

export const AgentEditorNodeContents: React.FC<{
	agentId: string;
	nodeId: string;
	node: AgentWorkflowNode;
}> = ({ agentId, nodeId }) => {
	const node = useNode(agentId, nodeId);
	const { formattedTitle, formattedDescription } =
		useAgentEditorNodeFormattedDetails(node);
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
			<NodeDataExtracts items={node?.userData} />
		</div>
	);
};
