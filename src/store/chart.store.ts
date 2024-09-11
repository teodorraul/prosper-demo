import deepEqual from 'deep-equal';
import { action, makeObservable, observable } from 'mobx';
import { v4 as uuid } from 'uuid';

import {
    applyEdgeChanges, Connection, Edge, EdgeChange, NodeChange, Viewport, XYPosition
} from '@xyflow/react';

import { bodyPlaceholder } from '../components/ui/leftSidebarTypes';
import {
    API, APIRoute, AppNode, AppResource, Endpoint, Function, HTTPMethod
} from './chartStore.types';
import { OrbsStore } from './orbsStore';
import Store, { RootStore } from './root';
import { APIRoutesCollection, Collection, UUID } from './types';

// const initialNodes: AppNode[] = [
//     {
//         id: '1',
//         position: { x: 0, y: 0 },
//         dragHandle: '.drag-handle',
//         data: {
//             // code: 'test',
//             routes: [],
//         },
//         type: 'apiNode',
//     },
//     // {
//     //     id: '2',
//     //     position: { x: 320, y: -75 },
//     //     data: {
//     //         code: 'test',
//     //     },
//     //     dragHandle: '.drag-handle',
//     //     type: 'functionNode',
//     // },
// ];
// const initialEdges = [
//     { id: uuid(), source: '1', target: '2', type: 'connector' },
// ];
class State {
	apiRoutes: APIRoutesCollection;
	apis: Collection<API>;
	endpoints: Collection<Endpoint>;
	functions: Collection<Function>;
	viewport: Viewport;
	orbs: OrbsStore;

	constructor(persist: any) {
		this.apiRoutes = new APIRoutesCollection();
		this.apis = new Collection();
		this.endpoints = new Collection();
		this.functions = new Collection();
		this.viewport = {
			x: 0,
			y: 0,
			zoom: 1,
		};
		this.orbs = new OrbsStore(persist);

		makeObservable(this, {
			apiRoutes: observable,
			apis: observable,
			endpoints: observable,
			orbs: observable,
			functions: observable,

			removeNodeWithId: action,
		});
	}

	removeNodeWithId(id: string) {
		if (this.apis.at[id]) {
			this.apis.remove(id);
		}
		if (this.endpoints.at[id]) {
			this.endpoints.remove(id);
		}
		if (this.functions.at[id]) {
			this.functions.remove(id);
		}
	}

	getResourceWithId(id: string): AppResource | undefined {
		return (
			this.apis.at[id] ?? this.endpoints.at[id] ?? this.functions.at[id]
		);
	}

	getNodeWithId(id: string): AppNode | undefined {
		return (
			this.apis.at[id]?.node ??
			this.endpoints.at[id]?.node ??
			this.functions.at[id]?.node
		);
	}
}

type ChartState = {
	nodes: AppNode[];
	edges: Edge[];
};

export class ChartStore {
	rootStore: RootStore;
	state: State;
	nodes: AppNode[];
	edges: Edge[];
	viewport: Viewport;
	selectedNodes: { [id: string]: boolean };
	selectedEdges: { [id: string]: boolean };

	constructor(rootStore: RootStore) {
		this.state = new State(this.peristState);
		this.nodes = [];
		this.edges = [];
		this.selectedNodes = {};
		this.selectedEdges = {};

		makeObservable(this, {
			state: observable,
			nodes: observable,
			edges: observable,
			selectedNodes: observable,
			selectedEdges: observable,

			setAPIRouteURL: action,
			setAPIRouteQueryString: action,
			setAPIRouteHeaders: action,
			setAPIRouteBody: action,
			setAPIRouteMethod: action,

			addAPIRoute: action,
			deleteAPIRoute: action,
			addEndpoint: action,
			runNodesUpdate: action,
			addEndpointOrb: action,
			removeEndpointOrb: action,
			setEndpointDescription: action,
			setEndpointCode: action,
			setEndpointTests: action,

			onViewportChange: action,
			onNodesChange: action,
			onEdgesChange: action,
			onConnection: action,
		});

		this.rootStore = rootStore;
	}

	debugMountUp = async () => {
		const ChartID = "76aab85d-1e40-4f82-9777-49ba87f62eb7";

		let debugState = await this.loadState();

		if (debugState) {
			let object = JSON.parse(debugState);
			this.state.apiRoutes.initFromObject(object.apiRoutes);
			this.state.apis.initFromObject(object.apis);
			this.state.endpoints.initFromObject(object.endpoints);

			for (const endpointId of this.state.endpoints.all) {
				let endpoint = this.state.endpoints.at[endpointId];
				try {
					if (endpoint.code !== undefined) {
						await window.sync.saveFunction(
							endpointId,
							endpoint.code
						);
					}
					if (endpoint.tests !== undefined) {
						await window.sync.saveTests(endpointId, endpoint.tests);
					}
				} catch (e) {
					console.error(
						"failed to save",
						endpoint.code,
						endpoint.tests
					);
				}
			}

			if (object.viewport) {
				this.state.viewport = object.viewport;
			}

			if (object.orbs) {
				this.state.orbs.mountFromJSON(object.orbs);
			}
		} else {
			this.state.apis.insert({
				id: uuid(),
				type: "api",
				node: {
					position: { x: 0, y: 0 },
					type: "apiNode",
				},
			});
		}

		this.runNodesUpdate();
	};

	addEndpoint = async (at: XYPosition) => {
		let node: Endpoint = {
			id: uuid(),
			type: "endpoint",
			orbs: [],
			node: {
				position: at,
				type: "endpointNode",
			},
		};
		this.state.endpoints.insert(node);

		this.runNodesUpdate();
	};

	addAPIRoute = async (apiNodeID: UUID) => {
		let blankRoute: APIRoute = {
			id: uuid(),
			forRouterId: apiNodeID,
			url: "",
			method: "GET",
		};

		this.state.apiRoutes.insertForAPINodeId(apiNodeID, blankRoute);

		this.runNodesUpdate();
	};

	peristState = async () => {
		let s = JSON.stringify(this.state);
		if (s) {
			localStorage.setItem("_debugState", s);
		}
	};

	loadState = async () => {
		let debugState = localStorage.getItem("_debugState");
		if (debugState) {
			return debugState;
		}
		return null;
	};

	deleteAPIRoute = async (forAPINodeId: UUID, routeId: UUID) => {
		this.state.apiRoutes.removeFromAPINodeId(forAPINodeId, routeId);

		this.peristState();
		// let node = await Database.transaction(
		//     'rw',
		//     [Database.apiNodes],
		//     async () => {
		//         const node = await Database.apiNodes.get(forAPINodeId);
		//         if (node) {
		//             node.data.routes = arrayExclude(node.data.routes, routeId);
		//             await Database.apiNodes.put(node, forAPINodeId);
		//         }
		//         return node;
		//     }
		// );
		// this.setNodes(arrayUpdate(this.nodes, forAPINodeId, node));
	};

	onViewportChange = (viewport: Viewport) => {
		if (!deepEqual(this.state.viewport, viewport)) {
			this.state.viewport = viewport;
			this.runNodesUpdate();
		}
	};

	setAPIRouteMethod = (apiRouteId: string, method: HTTPMethod) => {
		this.state.apiRoutes.at[apiRouteId].method = method;
		if (method != "POST") {
			this.state.apiRoutes.at[apiRouteId].body = bodyPlaceholder;
		}
		this.peristState();
	};

	setAPIRouteQueryString = (apiRouteId: string, qs: string) => {
		this.state.apiRoutes.at[apiRouteId].queryString = qs;
		this.peristState();
	};

	setAPIRouteHeaders = (apiRouteId: string, headers: string) => {
		this.state.apiRoutes.at[apiRouteId].headers = headers;
		this.peristState();
	};

	setAPIRouteBody = (apiRouteId: string, body: string) => {
		this.state.apiRoutes.at[apiRouteId].body = body;
		this.peristState();
	};

	setAPIRouteURL = (apiRouteId: string, url: string) => {
		this.state.apiRoutes.at[apiRouteId].url = url;
		this.peristState();
	};

	addEndpointOrb = (endpointId: string, orbId: string) => {
		this.state.endpoints.at[endpointId].orbs.push(orbId);
		this.peristState();
	};

	removeEndpointOrb = (endpointId: string, orbId: string) => {
		this.state.endpoints.at[endpointId].orbs = this.state.endpoints.at[
			endpointId
		].orbs.filter((id) => id != orbId);
		this.peristState();
	};

	setEndpointDescription = (endpointId: string, description: string) => {
		this.state.endpoints.at[endpointId].description = description;
		this.peristState();
	};

	saveEndpointCode = async (endpointId: string, code: string) => {
		await window.sync.saveFunction(endpointId, code);
		this.setEndpointCode(endpointId, code);
	};

	setEndpointCode = (endpointId: string, code: string) => {
		this.state.endpoints.at[endpointId].code = code;
		this.peristState();
	};

	saveEndpointTests = async (endpointId: string, tests: string) => {
		let modified = tests.replaceAll("test(", "Deno.test(");
		let withImports =
			`import { requestHandler } from "./${endpointId}.ts";\nimport { assert } from "jsr:@std/assert@1";\n\n`.replace(
				/\t/g,
				""
			) + modified;
		await window.sync.saveTests(endpointId, withImports);
		this.setEndpointTests(endpointId, tests);
	};

	setEndpointTests = (endpointId: string, tests: string) => {
		this.state.endpoints.at[endpointId].tests = tests;
		this.peristState();
	};

	onEdgesChange = (changes: EdgeChange[]) => {
		this.edges = applyEdgeChanges(changes, this.edges);

		for (const change of changes) {
			if (change.type == "remove") {
				let res = this.state.getResourceWithId(change.id);

				if (res.type == "endpoint") {
					let alreadyLinkedEndpoint = this.state.endpoints.at[res.id];
					if (alreadyLinkedEndpoint.connectedToRouteId != undefined) {
						alreadyLinkedEndpoint.connectedToRouteId = undefined;
						this.runNodesUpdate();
					}
				}
			}

			if (change.type == "select") {
				if (change.selected) {
					this.selectedEdges[change.id] = true;

					Store.ui.setLeftPanelOpen({
						openForEdge: change.id,
					});
				} else {
					delete this.selectedEdges[change.id];
					Store.ui.closeAllPanels();
				}
			}

			// let id = change.id;

			// if (change.selected) {
			//     if (!this.selectedNodes[id]) {
			//         this.selectedNodes[id] = true;
			//         this.runNodesUpdate();
			//     }
			// } else {
			//     if (this.selectedNodes[id] == true) {
			//         delete this.selectedNodes[id];
			//         this.runNodesUpdate();
			//     }
			// }
		}
	};

	onNodesChange = (changes: NodeChange[]) => {
		for (const change of changes) {
			switch (change.type) {
				case "add":
					break;
				case "dimensions":
					break;
				case "remove":
					this.state.removeNodeWithId(change.id);
					break;
				case "replace":
					break;
				case "position": {
					let id = change.id;
					let node = this.state.getNodeWithId(id);

					if (change.position.x && change.position.y) {
						if (!deepEqual(node.position, change.position)) {
							node.position = change.position;
							this.runNodesUpdate();
						}
					}
					break;
				}
				case "select": {
					let id = change.id;

					if (change.selected) {
						if (!this.selectedNodes[id]) {
							this.selectedNodes[id] = true;
							this.runNodesUpdate();
						}
					} else {
						if (this.selectedNodes[id] == true) {
							delete this.selectedNodes[id];
							this.runNodesUpdate();
						}
					}

					break;
				}
			}
		}
	};

	onConnection = (connection: Connection) => {
		let res = this.state.getResourceWithId(connection.target);

		if (res.type == "endpoint") {
			if (res.connectedToRouteId !== connection.sourceHandle) {
				let alreadyLinkedEndpointId = this.state.endpoints.all.find(
					(endpointId) => {
						let endpoint = this.state.endpoints.at[endpointId];
						return (
							endpoint.connectedToRouteId ==
							connection.sourceHandle
						);
					}
				);
				let alreadyLinkedEndpoint =
					this.state.endpoints.at[alreadyLinkedEndpointId];
				if (alreadyLinkedEndpoint) {
					alreadyLinkedEndpoint.connectedToRouteId = undefined;
				}
				res.connectedToRouteId = connection.sourceHandle;
				this.runNodesUpdate();
			}
		}

		if (!connection.target) {
			const apiRouteId = connection.sourceHandle;
			let linkedEndpointId = this.state.endpoints.all.find(
				(endpointId) => {
					let endpoint = this.state.endpoints.at[endpointId];
					return endpoint.connectedToRouteId == apiRouteId;
				}
			);
			if (this.state.endpoints.at[linkedEndpointId].connectedToRouteId) {
				this.state.endpoints.at[linkedEndpointId].connectedToRouteId =
					undefined;
				this.runNodesUpdate();
			}
		}
	};

	runNodesUpdate = () => {
		let nodes = [
			...Object.values(this.state.apis.at).map((m) => ({
				...m.node,
				id: m.id,
				dragHandle: ".drag-handle",
				selected: !!this.selectedNodes[m.id],
			})),
			...Object.values(this.state.endpoints.at).map((m) => ({
				...m.node,
				id: m.id,
				dragHandle: ".drag-handle",
				selected: !!this.selectedNodes[m.id],
			})),
			...Object.values(this.state.functions.at).map((m) => ({
				...m.node,
				id: m.id,
				dragHandle: ".drag-handle",
				selected: !!this.selectedNodes[m.id],
			})),
		];

		if (!deepEqual(this.nodes, nodes)) {
			this.nodes = nodes;
		}

		if (!deepEqual(this.viewport, this.state.viewport)) {
			this.viewport = this.state.viewport;
		}

		var edges: Edge[] = [];
		for (const endpointId of this.state.endpoints.all) {
			const endpoint = this.state.endpoints.at[endpointId];
			let routeId = endpoint?.connectedToRouteId;

			if (routeId) {
				let routerId = this.state.apiRoutes.at[routeId].forRouterId;
				edges.push({
					type: "endpointConnector",
					id: endpointId,
					source: routerId,
					sourceHandle: routeId,
					target: endpointId,
					targetHandle: undefined,
					selected: this.selectedEdges[endpointId],
				});
			}
		}
		if (!deepEqual(this.edges, edges)) {
			this.edges = edges;
		}

		this.peristState();
	};
}

// nodes: initialNodes,
//   edges: initialEdges,
//   onNodesChange: (changes) => {
//     set({
//       nodes: applyNodeChanges(changes, get().nodes),
//     });
//   },
//   onEdgesChange: (changes) => {
//     set({
//       edges: applyEdgeChanges(changes, get().edges),
//     });
//   },
//   onConnect: (connection) => {
//     set({
//       edges: addEdge(connection, get().edges),
//     });
//   },
//   setNodes: (nodes) => {
//     set({ nodes });
//   },
//   setEdges: (edges) => {
//     set({ edges });
//   },
// }));
