import { observer } from 'mobx-react';
import { useStore } from 'src/store/useStore';

import {
	useAgentEditorNodeFormattedDetails,
	useNodeDetails,
} from './agentEditorNode.hooks';
import {
	AgentEditorSidebarContainerStyle,
	AgentEditorSidebarStyle,
	AgentEditorSidebarTitleStyle,
} from './agentEditorSidebar.css';
import { AESCNode } from './agentEditorSidebarContentNode';
import { AESCRootNode } from './agentEditorSidebarContentsRootNode';

export const AgentEditorSidebar = observer(() => {
	const store = useStore();
	const selectedNodeId = store.agentEditor.selectedNode;
	const selectedNodeDetails = useNodeDetails(selectedNodeId);
	const { formattedTitle } =
		useAgentEditorNodeFormattedDetails(selectedNodeDetails);

	return (
		<aside className={`${AgentEditorSidebarContainerStyle} editor-sidebar`}>
			{selectedNodeDetails && (
				<div className={AgentEditorSidebarStyle}>
					<h5 className={AgentEditorSidebarTitleStyle}>
						{formattedTitle}
					</h5>
					{selectedNodeDetails?.nodeType == 'start_call' && (
						<AESCRootNode key={selectedNodeId} />
					)}
					{selectedNodeDetails?.nodeType == 'default' && (
						<AESCNode
							nodeId={selectedNodeId}
							key={selectedNodeId}
						/>
					)}
				</div>
			)}
		</aside>
	);
});
