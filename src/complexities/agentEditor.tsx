import '@xyflow/react/dist/base.css';

import { observer } from 'mobx-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'src/components/button';
import { Logo } from 'src/components/logo';
import { useClickHandler } from 'src/hooks/useClickHandler';
import { useAgentEditor } from 'src/store/agentEditor.hooks';
import { useStore } from 'src/store/useStore';

import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react';

import {
	AgentEditorChartStyle,
	AgentEditorHeader,
	AgentEditorStyle,
} from './agentEditor.css';
import { useAgentEditorHotkeys } from './agentEditor.hotkeys';
import { useAgentEditorSpanner } from './agentEditor.spanner';
import { AgentEditorEdge } from './agentEditorEdge';
import { AgentEditorNode } from './agentEditorNode';
import { AgentEditorSidebar } from './agentEditorSidebar';
import { AgentEditorSyncingBar } from './agentEditorSyncingBar';

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
			if (event.code === 'Space') {
				setIsSpacePressed(true);
			}
		};

		const handleKeyUp = (event) => {
			if (event.code === 'Space') {
				setIsSpacePressed(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	useEffect(() => {
		const handleClick = (e) => {
			if (
				e.target.closest('.prevent-selection-loss') ||
				e.target.classList.contains('prevent-selection-loss')
			) {
				return;
			}
		};

		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, []);

	const store = useStore();

	const handleClick = useClickHandler(
		'node-id',
		(id, event) => {
			store.agentEditor.selectNode(id);
		},
		[store]
	);

	useAgentEditor(agentId);
	useAgentEditorSpanner();

	let state = rootStore.agentEditor;

	const handleMouseMoved = useCallback((event: any) => {
		let targetElement = event.target.classList.contains('rendered-node')
			? event.target
			: event.target.closest('.rendered-node');

		if (targetElement) {
			const rect = targetElement.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			let nodeId = targetElement.getAttribute('data-node-id');

			if (event.clientX < centerX) {
				store.agentEditor.setHoveredNode({
					id: nodeId,
					side: 'left',
				});
			} else {
				store.agentEditor.setHoveredNode({
					id: nodeId,
					side: 'right',
				});
			}
		} else {
			store.agentEditor.setHoveredNode(undefined);
		}
	}, []);
	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMoved);
		return () => {
			document.removeEventListener('mousemove', handleMouseMoved);
		};
	}, [handleMouseMoved]);

	return (
		<main className={AgentEditorStyle}>
			<div className={AgentEditorHeader}>
				<Button
					title="←"
					circle
					type="subtle"
					to={`${process.env.ROOT_PATH}/agents`}
				/>
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
				nodeClickDistance={50}
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
			<AgentEditorSyncingBar />
		</main>
	);
});
