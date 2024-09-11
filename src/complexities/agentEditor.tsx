import "@xyflow/react/dist/base.css";

import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "src/components/button";
import { Logo } from "src/components/logo";
import { useStore } from "src/store/useStore";

import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";

import {
	AgentEditorChartStyle,
	AgentEditorHeader,
	AgentEditorSidebar,
	AgentEditorStyle,
} from "./agentEditor.css";
import { AgentEditorNodesStart } from "./agentEditorNodesStart";

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

	const rootStore = useStore();

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

	let store = rootStore.agentEditor;
	let state = store.state;
	return (
		<main className={AgentEditorStyle}>
			<div className={AgentEditorHeader}>
				<Button title="←" circle type="subtle" to="/agents" />
				<Logo />
			</div>
			<ReactFlow
				nodes={state.nodes}
				edges={state.edges}
				onViewportChange={store.handleViewportChange}
				// edgeTypes={edgeTypes}
				nodeTypes={nodeTypes}
				viewport={store.viewport}
				// onNodesChange={store.chart.onNodesChange}
				// onEdgesChange={store.chart.onEdgesChange}
				nodesFocusable
				// onConnect={store.chart.onConnection}
				// onlyRenderVisibleElements={true}
				// proOptions={proOptions}
				// fitViewOptions={initialZoomOption}
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
				zoomOnScroll={false}
				panOnScroll={true}
				className={AgentEditorChartStyle}
				panOnDrag={isSpacePressed}
				zoomOnDoubleClick={false}
			>
				<Background
					id="1"
					className={AgentEditorStyle}
					gap={25}
					size={2}
					color="rgba(0,0,0,0.2)"
					variant={BackgroundVariant.Dots}
				/>
			</ReactFlow>
			<aside className={AgentEditorSidebar}></aside>
		</main>
	);
});
