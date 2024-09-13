import { useEffect } from 'react';
import { useStore } from 'src/store/useStore';

import { getNodesBounds, useReactFlow } from '@xyflow/react';

import { useRenderedNode } from './agentEditorNode.hooks';

const MOVE_TIME = 500;
export const useAgentEditorSpanner = () => {
	const store = useStore();
	let flow = useReactFlow();

	const selectedNode = store.agentEditor.selectedNode;
	const node = useRenderedNode(selectedNode) as any;

	useEffect(() => {
		const vp = flow.getViewport();
		if (node && node.measured) {
			let bounds = getNodesBounds([node]);
			let centerX = bounds.x + bounds.width / 2;
			let centerY = bounds.y + bounds.height / 2;
			vp.x = bounds.x;
			vp.y = bounds.y;

			let sidebar = document.querySelector('.editor-sidebar');
			let width = sidebar?.getBoundingClientRect().width ?? 0;

			console.log('ww', width);
			flow.setCenter(centerX + width / 2, centerY, {
				zoom: 1,
				duration: MOVE_TIME,
			});
		}
	}, [flow, node]);
};
