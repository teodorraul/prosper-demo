import { action, computed, observable } from 'mobx';

import { AgentEditorStore } from './agentEditor.store';
import { AgentsStore } from './agents.store';
import { Agent } from './agents.types';

export class RootStore {
	@observable accessor fontsLoaded = false;
	@observable accessor agents = new AgentsStore();
	@observable accessor agentEditor = new AgentEditorStore();

	@action.bound
	setFontsReady() {
		this.fontsLoaded = true;
	}

	@computed
	get currentAgent(): Agent | undefined {
		let id = Store.agentEditor.mountedAgentId
		if (id) {
			return this.agents.byId.get(id)
		}
		return undefined
	}
}

const Store = new RootStore();
export default Store;
