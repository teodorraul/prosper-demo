import '@xyflow/react/dist/base.css';

import { observer } from 'mobx-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'src/components/button';
import { Logo } from 'src/components/logo';
import { useClickHandler } from 'src/hooks/useClickHandler';
import { useAgentEditor } from 'src/store/agentEditor.hooks';
import { useStore } from 'src/store/useStore';

import { Background, BackgroundVariant, ReactFlow, useNodesInitialized } from '@xyflow/react';

import { AgentEditorChartStyle, AgentEditorHeader, AgentEditorStyle } from './agentEditor.css';
import { useAgentEditorHotkeys } from './agentEditor.hotkeys';
import { useAgentEditorSpanner } from './agentEditor.spanner';
import { AgentEditorEdge } from './agentEditorEdge';
import { AgentEditorNode } from './agentEditorNode';
import { AgentEditorSidebar } from './agentEditorSidebar';

export const AgentEditor = observer(() => {
	let { id: agentId } = useParams();
	useAgentEditorHotkeys();

	const nodeTypes = useMemo(
		() => ({
			start: (props) => <AgentEditorNode {...props} draggable={false} />,
			node: (props) => <AgentEditorNode {...props} />,
			end: (props) => <AgentEditorNode {...props} />,
		}),
		[]
	);
	const edgeTypes = useMemo(
		() => ({
			edge: (props) => (
				<AgentEditorEdge
					{...props}
					className="prevent-selection-loss"
				/>
			),
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

	const nodesInitialized = useNodesInitialized();
	const store = useStore();

	const handleClick = useClickHandler(
		"node-id",
		(id, event) => {
			store.agentEditor.selectNode(id);
		},
		[store]
	);

	useEffect(() => {
		if (nodesInitialized) {
			store.agentEditor.relayoutNodes();
		}
	}, [nodesInitialized, store]);

	useAgentEditor(agentId ? parseInt(agentId) : undefined);
	useAgentEditorSpanner();

	let state = rootStore.agentEditor;

	return (
		<main className={AgentEditorStyle}>
			<div className={AgentEditorHeader}>
				<Button title="←" circle type="subtle" to="/agents" />
				<Logo />
			</div>
			<ReactFlow
				nodes={state.nodes}
				edges={state.edges}
				onViewportChange={state.handleViewportChange}
				edgeTypes={edgeTypes}
				nodeTypes={nodeTypes}
				viewport={state.viewport}
				onNodesChange={state.onNodesChange}
				onEdgesChange={state.onEdgesChange}
				nodesFocusable
				nodesDraggable={!isSpacePressed}
				nodesConnectable={!isSpacePressed}
				elementsSelectable={!isSpacePressed}
				onClick={handleClick}
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
				fitView
				fitViewOptions={{
					minZoom: 1,
					maxZoom: 1,
				}}
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
			<AgentEditorSidebar />
		</main>
	);
});
