import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "src/store/useStore";

import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";

import { AgentEditorStyle } from "./agentEditor.css";
import { AgentEditorNodesStart } from "./agentEditor.nodes.start";

export const AgentEditor = observer(() => {
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

	const store = useStore();

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
			if (
				e.target.closest(".prevent-selection-loss") ||
				e.target.classList.contains("prevent-selection-loss")
			) {
				return;
			}
			// store.ui.setLeftPanelOpen(undefined);
			// store.ui.setRightPanelOpen(undefined);
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
				zoomOnDoubleClick={false}
				multiSelectionKeyCode={"Space"}
			>
				<Background
					id="1"
					className={AgentEditorStyle}
					gap={25}
					size={2}
					color="#404346"
					variant={BackgroundVariant.Dots}
				/>
			</ReactFlow>
		</div>
	);
});
