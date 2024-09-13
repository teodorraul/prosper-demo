import { observer } from 'mobx-react';
import { NodeDataExtracts } from 'src/components/nodeDataExtracts';
import { NodeIf } from 'src/components/nodeIf';
import { Text } from 'src/components/text';
import { AgentWorkflowNode } from 'src/store/agents.types';

import { AEMContextGrid } from './agentEditorNode.css';
import {
	useAgentEditorNodeFormattedDetails,
	useNodeDetails,
} from './agentEditorNode.hooks';

export const AgentEditorNodeContents: React.FC<{
	nodeId: string;
	node: AgentWorkflowNode;
}> = observer(({ nodeId }) => {
	const nodeDetails = useNodeDetails(nodeId);
	const { formattedTitle, formattedDescription } =
		useAgentEditorNodeFormattedDetails(nodeDetails);
	const hasNoDescription = nodeDetails?.nodeEnterCondition == '';
	return (
		<div className="node-container">
			<Text
				level="title"
				ctx="node"
				color={!formattedTitle ? 'barelyVisible' : 'text'}
			>
				{formattedTitle || 'Untitled Function'}
			</Text>
			<div className={AEMContextGrid}>
				<NodeIf />
				<Text
					level="body"
					ctx="node"
					color={hasNoDescription ? 'barelyVisible' : 'subtle'}
				>
					{hasNoDescription
						? 'Always executes.'
						: formattedDescription}
				</Text>
			</div>
			{nodeDetails?.userData?.length > 0 && (
				<NodeDataExtracts items={nodeDetails?.userData} />
			)}
		</div>
	);
});
