import { AgentsStore } from "./agents.store";

export class RootStore {
	agents: AgentsStore;

	constructor() {
		this.agents = new AgentsStore();
	}
}

const Store = new RootStore();
export default Store;
