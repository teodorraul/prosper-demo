import { useEffect } from 'react';

import { useStore } from './useStore';

export const useAgents = () => {
	const store = useStore();

	useEffect(() => {
		store.agents.fetchAgents();
	}, []);
};
