import {
    AENGlobalRowDescriptionStyle, AENGlobalRowStyle, AENGlobalRowTitleStyle
} from './agentEditorGlobalNodeRow.css';
import { useAgentEditorNodeFormattedDetails, useNodeDetails } from './agentEditorNode.hooks';

export const AgentEditorGlobalNodeRow: React.FC<{
	nodeId: string;
}> = ({ nodeId }) => {
	const details = useNodeDetails(nodeId);

	const { formattedDescription, formattedTitle } =
		useAgentEditorNodeFormattedDetails(details);

	return (
		<li className={AENGlobalRowStyle}>
			<h5 className={AENGlobalRowTitleStyle}>{formattedTitle}</h5>
			<p className={AENGlobalRowDescriptionStyle}>
				{formattedDescription}
			</p>
		</li>
	);
};
