import { useEffect } from 'react';

import { useStore } from './useStore';

export const useAgentEditor = (agentId?: string) => {
	const store = useStore();

	useEffect(() => {
		if (agentId) {
			store.agentEditor.mountWithAgentId(agentId);
		}
	}, []);
};
