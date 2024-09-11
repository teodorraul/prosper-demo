import { action, computed, observable } from 'mobx';

import { Agent } from './agents.types';
import { sleep } from './utils';

export class AgentsStore {
	@observable accessor agents = observable.map<string, Agent>();

	constructor() {
		let agent = new Agent();
		agent.id = 1;
		agent.prompt =
			"Your name is Sara, you're a call receiver at Cleveland Clinic";

		let agentTwo = new Agent();
		agentTwo.id = 2;
		agentTwo.prompt = "You're Rob, you're AFK";

		this.storeAgent(agent);
		this.storeAgent(agentTwo);
	}

	addAgent = async () => {
		await sleep(500);
		let agent = new Agent();
		this.storeAgent(agent);
	};

	@action
	storeAgent = (agent: Agent) => {
		this.agents.set(agent.id, agent);
	}

	@computed
	get all() {
		return Array.from(this.agents.values());
	}
}
