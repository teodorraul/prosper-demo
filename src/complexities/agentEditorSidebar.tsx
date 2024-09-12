import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { useStore } from 'src/store/useStore';

import { useAgentEditorNodeFormattedDetails, useNodeDetails } from './agentEditorNode.hooks';
import {
    AgentEditorSidebarCardStyle, AgentEditorSidebarContainerStyle, AgentEditorSidebarStyle,
    AgentEditorSidebarTitleStyle
} from './agentEditorSidebar.css';

export const AgentEditorSidebar = observer(() => {
	let { id: agentId } = useParams();

	const store = useStore();
	const selectedNodeId = store.agentEditor.selectedNode;
	const selectedNodeDetails = useNodeDetails(agentId, selectedNodeId);
	const { formattedTitle } =
		useAgentEditorNodeFormattedDetails(selectedNodeDetails);

	return (
		<aside className={AgentEditorSidebarContainerStyle}>
			{store.agentEditor.selectedNode && (
				<div className={AgentEditorSidebarStyle}>
					<h5 className={AgentEditorSidebarTitleStyle}>
						{formattedTitle}
					</h5>
					<div className={AgentEditorSidebarCardStyle}>
						<span>test</span>
					</div>
				</div>
			)}
		</aside>
	);
});
