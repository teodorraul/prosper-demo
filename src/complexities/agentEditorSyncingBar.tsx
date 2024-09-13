import { observer } from 'mobx-react';
import { useBlocker } from 'react-router-dom';
import { useStore } from 'src/store/useStore';

import { AgentEditorSyncingBarStyle } from './agentEditorSyncingBar.css';

export const AgentEditorSyncingBar = observer(() => {
	const store = useStore();
	useBlocker(
		({ currentLocation, nextLocation }) => store.agentEditor.syncing
	);

	if (store.agentEditor.syncing) {
		return <div className={AgentEditorSyncingBarStyle}>Syncing...</div>;
	}
	return <></>;
});
