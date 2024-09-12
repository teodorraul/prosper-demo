import { useEffect } from 'react';
import { useStore } from 'src/store/useStore';

import { getNodesBounds, useReactFlow } from '@xyflow/react';

const MOVE_TIME = 500;
export const useAgentEditorSpanner = () => {
	const store = useStore();
	let flow = useReactFlow();

	const selectedNode = store.agentEditor.selectedNode;

	useEffect(() => {
		const vp = flow.getViewport();
		if (selectedNode) {
			let node = flow.getNode(selectedNode);
			if (node) {
				let bounds = getNodesBounds([node]);
				let centerX = bounds.x + bounds.width / 2;
				let centerY = bounds.y + bounds.height / 2;
				vp.x = bounds.x;
				vp.y = bounds.y;
				flow.setCenter(centerX + 40, centerY, {
					zoom: 1,
					duration: MOVE_TIME,
				});
			}
		}
	}, [flow, selectedNode]);
};
