import { observer } from 'mobx-react';
import { AgentEditor } from 'src/complexities/agentEditor';
import { LoadingContainer } from 'src/components/loadingContainer';
import { useAgents } from 'src/store/agents.hooks';
import { useStore } from 'src/store/useStore';

import { ReactFlowProvider } from '@xyflow/react';

const AgentsIdRoute = observer(() => {
	const store = useStore();

	useAgents();

	return (
		<LoadingContainer
			status={store.agents.fetchStatus}
			keepLoading={!store.fontsLoaded}
			size="medium"
		>
			<ReactFlowProvider>
				<AgentEditor />
			</ReactFlowProvider>
		</LoadingContainer>
	);
});

export default AgentsIdRoute;
