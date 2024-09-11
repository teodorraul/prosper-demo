import deepEqual from 'deep-equal';
import { action, observable } from 'mobx';

import { Viewport } from '@xyflow/react';

export class AgentEditorStore {
	nodes = observable.map();
	state = {
		nodes: [],
		edges: []
	}
	@observable accessor viewport: Viewport = {
		x: 0,
		y: 0,
		zoom: 1
	};
	removeNodeWithId = (id: string) =>{
		this.nodes.delete(id)
	}

	@action.bound
	handleViewportChange(viewport: Viewport) {
		if (!deepEqual(this.viewport, viewport)) {
			this.viewport = viewport;
		}
	}
}
