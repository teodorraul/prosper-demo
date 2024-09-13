import { observable } from 'mobx';
import { v4 as uuid } from 'uuid';

export class Agent {
	id: string;
	@observable accessor createdAt: Date;
	@observable accessor updatedAt: Date | undefined;
	@observable accessor workflow: AgentWorkflow;

	constructor(remote?: RemoteAgent) {
		if (remote) {
			this.id = `${remote.id}`;
			this.createdAt = new Date(remote.created_at);
			this.updatedAt = remote.updated_at
				? new Date(remote.updated_at)
				: undefined;
			this.workflow = new AgentWorkflow(remote);
		} else {
			this.id = '';
			this.createdAt = new Date();
			this.workflow = new AgentWorkflow();
		}
	}

	get serializedForSupa(): RemoteAgent {
		let payload: RemoteAgent = {
			created_at: this.createdAt.toISOString(),
			updated_at: this.updatedAt?.toISOString(),
			data: this.workflow.serializedForSupa,
		};

		if (this.id) {
			payload.id = parseInt(this.id);
		}

		return payload;
	}
}
export class AgentWorkflow {
	readonly generalInstructions: string;
	readonly edges: AgentWorkflowEdge[];
	readonly nodes: AgentWorkflowNode[];

	constructor(remote?: RemoteAgent) {
		if (remote) {
			this.edges = [];
			this.nodes = [];
			this.generalInstructions = remote.data.general_instructions;

			for (const node of remote.data.nodes) {
				this.nodes.push(new AgentWorkflowNode(node));
			}
			for (const edge of remote.data.edges) {
				this.edges.push(new AgentWorkflowEdge(edge));
			}
		} else {
			this.generalInstructions = '';
			let startNode = new AgentWorkflowNode();
			this.edges = [];
			this.nodes = [startNode];
		}
	}

	get serializedForSupa(): RemoteAgent['data'] {
		let edges: RemoteAgentEditorEdge[] = [];
		let nodes: RemoteAgentEditorNode[] = [];

		for (const node of this.nodes) {
			nodes.push(node.serializedForSupa);
		}
		for (const edge of this.edges) {
			edges.push(edge.serializedForSupa);
		}

		return {
			edges,
			nodes,
			general_instructions: this.generalInstructions,
		};
	}
}

export class AgentWorkflowEdge {
	id: string;
	label: string | null;
	readonly source: number;
	readonly target: number;

	constructor(remote: RemoteAgentEditorEdge) {
		this.id = `${remote.id}`;
		this.label = remote.label;
		this.source = remote.source;
		this.target = remote.target;
	}

	get serializedForSupa(): RemoteAgentEditorEdge {
		return {
			id: this.id,
			label: this.label,
			source: this.source,
			target: this.target,
		};
	}
}

export class AgentWorkflowNode {
	id: string;
	readonly nodeEnterCondition: string;
	readonly nodeName: string;
	readonly nodeType: RemoteNodeType;
	readonly prompt: string;
	readonly isGlobal: boolean;
	readonly order: number;
	readonly userData: AgentEditorNodeUserData[];
	rank: number | undefined;

	constructor(remote?: RemoteAgentEditorNode) {
		if (remote) {
			this.id = `${remote.id}`;
			this.nodeEnterCondition = remote.node_enter_condition;
			this.nodeName = remote.node_name;
			this.nodeType = remote.node_type;
			this.prompt = remote.prompt;
			this.isGlobal = remote.is_global;
			this.order = remote.order ?? 1;
			this.userData = [];

			if (remote.is_global) {
				this.nodeType = 'global';
			}

			if (remote.node_name == 'start_call') {
				this.nodeType = 'start_call';
			}

			for (const data of remote.user_data) {
				this.userData.push(new AgentEditorNodeUserData(data));
			}
		} else {
			//teo
			// should not happent
			this.id = uuid();
			this.nodeType = 'start_call';
			this.nodeName = 'call_start';
			this.prompt = '';
			this.order = 1;
			this.isGlobal = false;
			this.userData = [];
			this.nodeEnterCondition = '';
		}
	}

	get serializedForSupa(): RemoteAgentEditorNode {
		let data: RemoteAgentEditorNodeUserData[] = [];

		for (const i of this.userData) {
			data.push(i.serializedForSupa);
		}

		return {
			id: this.id,
			node_name: this.nodeName,
			node_enter_condition: this.nodeEnterCondition,
			node_type: this.nodeType,
			prompt: this.prompt,
			order: this.order,
			is_global: this.isGlobal,
			user_data: data,
		};
	}

	get serializedUserDataForSupa(): RemoteAgentEditorNodeUserData[] {
		let data: RemoteAgentEditorNodeUserData[] = [];

		for (const i of this.userData) {
			data.push(i.serializedForSupa);
		}

		return data;
	}
}

export class AgentEditorNodeUserData {
	id: string;
	name: string;
	readonly dataType: string;
	readonly description: string;

	constructor(remoteData: RemoteAgentEditorNodeUserData) {
		this.id = remoteData.id || uuid();
		this.name = remoteData.name;
		this.description = remoteData.description;
		this.dataType = remoteData.data_type;
	}

	get serializedForSupa(): RemoteAgentEditorNodeUserData {
		return {
			id: this.id,
			name: this.name,
			data_type: this.dataType,
			description: this.description,
		};
	}
}

// Remote Data

export type RemoteAgent = {
	id?: number;
	updated_at: any | undefined;
	created_at: string;
	data: {
		edges: RemoteAgentEditorEdge[];
		general_instructions: string;
		nodes: RemoteAgentEditorNode[];
	};
};

export type RemoteAgentEditorEdge = {
	id: string;
	label: string | null;
	source: string;
	target: string;
};

export type RemoteAgentEditorNode = {
	id: string;
	node_enter_condition: string;
	node_name: string;
	node_type: RemoteNodeType;
	prompt: string;
	order?: number;
	is_global: boolean;
	user_data: RemoteAgentEditorNodeUserData[];
};

export type RAENodePayload = Omit<RemoteAgentEditorNode, 'id'>;
type DeprecatedNodeTypes = 'transfer_call';
export type RemoteNodeType =
	| 'default'
	| DeprecatedNodeTypes
	| 'global'
	| 'start_call'
	| 'end_call';

export type RemoteAgentEditorNodeUserData = {
	id: string | undefined;
	name: string;
	data_type: string;
	description: string;
};
