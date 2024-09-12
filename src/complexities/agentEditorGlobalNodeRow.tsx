import {
    AENGlobalRowDescriptionStyle, AENGlobalRowStyle, AENGlobalRowTitleStyle
} from './agentEditorGlobalNodeRow.css';
import { useAgentEditorNodeFormattedDetails, useNode } from './agentEditorNode.hooks';

export const AgentEditorGlobalNodeRow: React.FC<{
	agentId: string;
	nodeId: string;
}> = ({ agentId, nodeId }) => {
	const node = useNode(agentId, nodeId);

	const { formattedDescription, formattedTitle } =
		useAgentEditorNodeFormattedDetails(node);

	return (
		<li className={AENGlobalRowStyle}>
			<h5 className={AENGlobalRowTitleStyle}>{formattedTitle}</h5>
			<p className={AENGlobalRowDescriptionStyle}>
				{formattedDescription}
			</p>
		</li>
	);
};
