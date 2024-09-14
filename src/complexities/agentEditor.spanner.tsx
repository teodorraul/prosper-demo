import { useEffect } from 'react';
import { useStore } from 'src/store/useStore';

import { getNodesBounds, useReactFlow } from '@xyflow/react';

import { useRenderedNode } from './agentEditorNode.hooks';

const MOVE_TIME = 800;
export const useAgentEditorSpanner = () => {
	const store = useStore();
	let flow = useReactFlow();

	const selectedNode = store.agentEditor.selectedNode;
	const node = useRenderedNode(selectedNode) as any;

	useEffect(() => {
		const vp = flow.getViewport();
		let rendered = document.querySelector(
			`[data-node-id="${selectedNode}"] .rendered-node`
		);
		const renderedNodeActualBoundingBox = rendered?.getBoundingClientRect();
		if (node && node.measured && renderedNodeActualBoundingBox) {
			let bounds = getNodesBounds([node]);
			let centerX = bounds.x + renderedNodeActualBoundingBox.width / 2;
			let centerY = bounds.y + renderedNodeActualBoundingBox.height / 2;
			vp.x = bounds.x;
			vp.y = bounds.y;

			let sidebar = document.querySelector('.editor-sidebar');
			let width = sidebar?.getBoundingClientRect().width ?? 0;

			flow.setCenter(centerX + width / 2, centerY, {
				zoom: 1,
				duration: MOVE_TIME,
			});
			console.log(centerX + width / 2, centerY);
		}
	}, [flow, node]);
};
