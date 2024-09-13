import { observer } from 'mobx-react';
import { Icon } from 'src/components/icon';
import { NodeDataExtracts } from 'src/components/nodeDataExtracts';
import { Text } from 'src/components/text';

import { useAgentEditorNodeFormattedDetails, useNodeDetails } from './agentEditorNode.hooks';
import {
    AENFNodeContainer, AENFNodeIcon, AENFNodeSecondContainer
} from './agentEditorNodeFinalContents.css';

export const AgentEditorNodeFinalContents: React.FC<{
	nodeId: string;
}> = observer(({ nodeId }) => {
	const details = useNodeDetails(nodeId);
	const { formattedTitle, formattedDescription } =
		useAgentEditorNodeFormattedDetails(details);

	return (
		<div className={AENFNodeContainer}>
			<Icon type="shutdown" className={AENFNodeIcon} />
			<Text level="title" ctx="node">
				{formattedTitle}
			</Text>
			<div className={AENFNodeSecondContainer}>
				{/* <NodeIf /> */}
				<Text level="body" ctx="node" color="subtle">
					{formattedDescription}
				</Text>
			</div>
			<NodeDataExtracts items={details?.userData} />
		</div>
	);
});
