import { action, computed, observable } from 'mobx';
import { Supa } from 'src/supabase';

import { Agent, RemoteAgent } from './agents.types';
import { FetchStatus } from './utils';

const TABLE = 'agents_2018';
export class AgentsStore {
	@observable accessor byId = observable.map<number, Agent>();
	@observable accessor fetchStatus: FetchStatus = 'initial';

	fetchAgents = async (destroyCache: boolean = false) => {
		// This also keeps the list while we're refreshing
		if (!destroyCache) {
			if (this.fetchStatus != 'error' && this.fetchStatus != 'initial') {
				return;
			}

			this.setFetchStatus('started');
		}

		const { data, error } = (await Supa.from(TABLE).select()) as {
			data: RemoteAgent[];
			error: Error | null;
		};

		if (error) {
			this.setFetchStatus('error');
			return;
		}

		let agents: Agent[] = [];

		for (const remoteAgent of data) {
			agents.push(new Agent(remoteAgent));
		}

		this.storeAgents(agents);
		this.setFetchStatus('done');
	};

	@action.bound
	setFetchStatus(status: FetchStatus) {
		this.fetchStatus = status;
	}

	@action.bound
	storeAgents(agents: Agent[]) {
		this.byId = observable.map<number, Agent>();
		for (const agent of agents) {
			this.byId.set(agent.id, agent);
		}
	}

	@computed
	get all() {
		return Array.from(this.byId.values());
	}

	createANewAgent = async () => {
		// const { error } = await Supa.from(TABLE).insert({ name: "Denmark" });
		let newAgent = new Agent();
		let serialized = newAgent.serializedForSupa;

		const { error } = await Supa.from(TABLE).insert(serialized);

		if (error) {
			console.log(error);
			return;
		}

		await this.fetchAgents(true);
	};

	deleteAnAgent = async (id: number) => {
		await Supa.from(TABLE).delete().eq('id', id);
		await this.fetchAgents(true);
	};
}
