import { action, observable } from 'mobx';

import { AgentEditorStore } from './agentEditor.store';
import { AgentsStore } from './agents.store';

export class RootStore {
	@observable accessor fontsLoaded = false;
	@observable accessor agents = new AgentsStore();
	@observable accessor agentEditor = new AgentEditorStore();

	@action.bound
	setFontsReady() {
		this.fontsLoaded = true;
	}
}

const Store = new RootStore();
export default Store;
