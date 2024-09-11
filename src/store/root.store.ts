import { observable } from 'mobx';

import { AgentEditorStore } from './agentEditor.store';
import { AgentsStore } from './agents.store';

export class RootStore {
	@observable accessor agents = new AgentsStore();
	@observable accessor agentEditor = new AgentEditorStore()
}

const Store = new RootStore();
export default Store;
