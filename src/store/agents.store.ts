import { action, computed, observable } from 'mobx';
import { Supa } from 'src/supabase';

import { SyncOperation } from './agentEditor.types';
import { Agent, RemoteAgent } from './agents.types';
import { FetchStatus } from './utils';

const TABLE = 'agents_2018';
export class AgentsStore {
	@observable accessor byId = observable.map<string, Agent>();
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
		this.byId = observable.map<string, Agent>();
		for (const agent of agents) {
			this.byId.set(agent.id, agent);
		}
	}

	@action.bound
	updateAgent(agent: Agent) {
		this.byId.set(agent.id, agent);
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
			console.error(error);
			return;
		}

		await this.fetchAgents(true);
	};

	deleteAnAgent = async (id: number) => {
		await Supa.from(TABLE).delete().eq('id', id);
		await this.fetchAgents(true);
	};

	applyAgentOp = async (id: string, op: SyncOperation) => {
		let { data, error } = await Supa.from(TABLE).select().eq('id', id);
		let agent = data?.[0] as RemoteAgent;

		if (error) {
			return { error };
		}

		if (agent) {
			switch (op.operation) {
				case 'upsert-node':
					agent.data.nodes = agent.data.nodes.filter(
						(f) => f.id != op.nodeDetails.id
					);
					agent.data.nodes.push(op.nodeDetails.serializedForSupa);
					agent.data.edges = agent.data.edges.filter(
						(e) => e.target != op.nodeDetails.id
					);
					if (op.parentId) {
						agent.data.edges.push({
							id: `${op.nodeDetails.id}_edge`,
							source: op.parentId,
							target: op.nodeDetails.id,
							label: '',
						});
					}
					break;
				case 'delete-node':
					agent.data.nodes = agent.data.nodes.filter(
						(f) => f.id != op.id
					);
					agent.data.edges = agent.data.edges.filter(
						(e) => e.target != op.id
					);
					break;
			}

			const { data, error } = await Supa.from(TABLE)
				.upsert(agent)
				.select();
			let remoteAgent = data?.[0] as RemoteAgent;

			let newAgent = new Agent(remoteAgent);
			this.updateAgent(newAgent);

			if (error) {
				return { error };
			} else {
				return { error: undefined };
			}
		} else {
			return { error: 'agent not found' };
		}
	};
}
