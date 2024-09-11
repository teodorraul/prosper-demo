import { observer } from 'mobx-react';
import { useMemo } from 'react';

import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react';

import { AgentEditorNodesStart } from './agentEditor.nodes.start';

export const AgentEdit = observer(() => {
	const nodeTypes = useMemo(
		() => ({
			start: (props) => (
				<AgentEditorNodesStart {...props} draggable={false} />
			),
			node: (props) => <AgentEditorNodesStart {...props} />,
			end: (props) => <AgentEditorNodesStart {...props} />,
		}),
		[]
	);

	const edgeTypes = useMemo(
		() => ({
			endpointConnector: (props) => (
				<EndpointConnectorEdge
					{...props}
					className="prevent-selection-loss"
				/>
			),
		}),
		[]
	);
	// const [nodes, setNodes] = useState(initialNodes);
	// const [edges, setEdges] = useState(initialEdges);

	// const onNodesChange = useCallback(
	//     (changes) => {
	//         setNodes((nds) => applyNodeChanges(changes, nds));
	//     },
	//     [setNodes]
	// );
	// const onEdgesChange = useCallback(
	//     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
	//     [setEdges]
	// );

	const store = useStore();

	// const onChange = useCallback(
	//     ({ nodes, edges }) => {
	//         console.log('0000', nodes, edges);
	//         store.ui.setSelection({
	//             nodes,
	//             edges,
	//         });
	//     },
	//     [store]
	// );

	// useOnSelectionChange({
	//     onChange,
	// });

	const [isSpacePressed, setIsSpacePressed] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.code === "Space") {
				setIsSpacePressed(true);
			}
		};

		const handleKeyUp = (event) => {
			if (event.code === "Space") {
				setIsSpacePressed(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useEffect(() => {
		const handleClick = (e) => {
			// console.log(
			//     '------------------',
			//     e.target,
			//     e.target.classList,
			//     e.target.classList.contains('react-flow__edge-interaction')
			// );
			// if (
			//     e.target.closest('.react-flow__edge-interaction') ||
			//     e.target.classList.contains('react-flow__edge-interaction')
			// ) {
			//     return;
			// }
			if (
				e.target.closest(".prevent-selection-loss") ||
				e.target.classList.contains("prevent-selection-loss")
			) {
				return;
			}
			store.ui.setLeftPanelOpen(undefined);
			store.ui.setRightPanelOpen(undefined);
		};

		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<ReactFlow
				nodes={store.chart.nodes}
				edges={store.chart.edges}
				onViewportChange={store.chart.onViewportChange}
				edgeTypes={edgeTypes}
				nodeTypes={nodeTypes}
				viewport={store.chart.viewport}
				onNodesChange={store.chart.onNodesChange}
				onEdgesChange={store.chart.onEdgesChange}
				nodesFocusable
				onConnect={store.chart.onConnection}
				// onlyRenderVisibleElements={true}
				proOptions={proOptions}
				fitViewOptions={initialZoomOption}
				nodesDraggable={!isSpacePressed}
				nodesConnectable={!isSpacePressed}
				elementsSelectable={!isSpacePressed}
				onEdgeDoubleClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				onEdgeContextMenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				panOnDrag={isSpacePressed}
				// zoomOnScroll={false}
				// panOnScroll={true}
				zoomOnDoubleClick={false}
				multiSelectionKeyCode={"Space"}
			>
				<Background
					id="1"
					className={`${Styles.chartBackground}`}
					gap={25}
					size={2}
					color="#404346"
					variant={BackgroundVariant.Dots}
				/>
			</ReactFlow>
			{/* <MiniMap /> */}
			{/* <Sidebar /> */}
		</div>
	);
});
