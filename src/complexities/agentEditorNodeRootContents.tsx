import { Button } from 'src/components/button';
import { Text } from 'src/components/text';

import { useAgentEditorNodeFormattedDetails, useNodeDetails } from './agentEditorNode.hooks';
import { AENGlobalNodesTitle } from './agentEditorNodeRootContents.css';

export const AgentEditorNodeRootContents: React.FC<{
	nodeId: string;
}> = ({ nodeId }) => {
	const nodeDetails = useNodeDetails(nodeId);
	const { formattedTitle, formattedDescription } =
		useAgentEditorNodeFormattedDetails(nodeDetails);
	// const globalNodesIds = useGlobalNodes(agentId);
	return (
		<div>
			<Text level="title" ctx="node">
				{formattedTitle}
			</Text>
			<Text level="body" ctx="node">
				{formattedDescription}
			</Text>
			<div>
				<h6 className={AENGlobalNodesTitle}>Global Behaviours</h6>
				{/* <ul className={AENGlobalNodesContainerStyle}>
					{globalNodesIds?.map((id) => {
						return (
							<AgentEditorGlobalNodeRow
								key={id}
								agentId={agentId}
								nodeId={`${id}`}
							/>
						);
					})}
				</ul> */}
				<Button title="Add new Behaviour" center type="subtlePrimary" />
			</div>
		</div>
	);
};
