import { observer } from 'mobx-react';
import { useCallback } from 'react';
import { Text } from 'src/components/text';
import { Textbox } from 'src/components/textbox';
import { useStore } from 'src/store/useStore';

import { AgentEditorSidebarCardStyle } from './agentEditorSidebar.css';
import { AESCRootNodePrompt } from './agentEditorSidebarContentsRootNode.css';

export const AESCRootNode = observer(() => {
	const store = useStore();

	// const handlePromptChange = useCallback((value: string) => {
	// 	store.agentEditor.setPrompt(value);
	// }, []);

	const handleDelayedChange = useCallback((value: string) => {
		store.agentEditor.notifyPromptUpdated(value);
	}, []);

	return (
		<>
			<div className={AgentEditorSidebarCardStyle}>
				<Text level="microtitle" color="subtle">
					Agent Prompt
				</Text>
				<Textbox
					area
					className={AESCRootNodePrompt}
					remoteValue={store.agentEditor.prompt}
					placeholder="Describe the agent's characteristics, i.e. where she's working it, etc."
					// onChange={handlePromptChange}
					autofocusIfEmpty
					onDelayedChange={handleDelayedChange}
				/>
			</div>
		</>
	);
});
