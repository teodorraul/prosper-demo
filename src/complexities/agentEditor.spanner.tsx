import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'src/store/useStore';

import { getNodesBounds, useReactFlow } from '@xyflow/react';

import { AgentEditorDisablingOverlay } from './agentEditor.css';
import { useRenderedNode } from './agentEditorNode.hooks';

export const useAgentEditorSpanner = () => {
	const store = useStore();
	let flow = useReactFlow();

	const selectedNodeId = store.agentEditor.selectedNode;
	const selectedNode = useRenderedNode(selectedNodeId) as any;
	const [isScrolling, setIsScrolling] = useState(false);
	const timer = useRef<NodeJS.Timeout>();

	useEffect(() => {
		const vp = flow.getViewport();
		let rendered = document.querySelector(
			`[data-node-id="${selectedNodeId}"] .rendered-node`
		);
		let viewport = document.querySelector<HTMLDivElement>(
			'.react-flow__viewport'
		);
		// let viewportBackground = document.querySelector<HTMLDivElement>(
		// 	'.react-flow__background pattern'
		// );
		const renderedNodeActualBoundingBox = rendered?.getBoundingClientRect();

		if (
			selectedNode &&
			selectedNode.measured &&
			renderedNodeActualBoundingBox &&
			viewport
			// viewportBackground
		) {
			let vdim = viewport.getBoundingClientRect();
			let bounds = getNodesBounds([selectedNode]);
			let centerX = bounds.x + renderedNodeActualBoundingBox.width / 2;
			let centerY = bounds.y + renderedNodeActualBoundingBox.height / 2;
			vp.x = bounds.x;
			vp.y = bounds.y;

			let sidebar = document.querySelector('.editor-sidebar');
			let width = sidebar?.getBoundingClientRect().width ?? 0;

			let center = {
				x: centerX + width / 2,
				y: centerY,
			};

			let vwCoords = {
				x: -1 * (center.x - vdim.width / 2),
				y: -1 * (center.y - vdim.height / 2),
			};

			let miliDur = 400;
			let transition = `${miliDur / 1000}s ease transform`;
			let transform = `translateX(${vwCoords.x}px) translateY(${vwCoords.y}px) scale(1)`;

			viewport.style.transition = transition;
			viewport.style.transform = transform;
			// viewportBackground.style.transition = transition;
			// viewportBackground.style.transform = transform;
			setIsScrolling(true);

			if (timer.current) {
				clearTimeout(timer.current);
			}

			timer.current = setTimeout(() => {
				viewport.style.transition = '';
				// viewportBackground.style.transition = '';
				setIsScrolling(false);

				flow.setCenter(center.x, center.y, {
					zoom: 1,
					duration: 0,
				});
			}, miliDur);
		}
	}, [flow, selectedNode]);

	const disablingOverlay = useMemo(() => {
		if (isScrolling) return <div className={AgentEditorDisablingOverlay} />;
		return <></>;
	}, [isScrolling]);

	return { disablingOverlay };
};
