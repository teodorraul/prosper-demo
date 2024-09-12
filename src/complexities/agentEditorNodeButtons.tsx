import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Button } from 'src/components/button';
import { useClickHandler } from 'src/hooks/useClickHandler';
import { useStore } from 'src/store/useStore';

import {
    AENButton, AENButtonLeftSide, AENButtonRightSide, AENButtonsHolder
} from './agentEditorNodeButtons.css';

export const AgentEditorNodeButtons: React.FC<{ nodeId: string }> = observer(
	({ nodeId }) => {
		const store = useStore();
		const hoveredSide = computed(() =>
			store.agentEditor.hoveredNode?.id == nodeId
				? store.agentEditor.hoveredNode.side
				: undefined
		).get();

		const handleAdd = useClickHandler(
			'side',
			(side: 'left' | 'right', ev) => {
				ev.stopPropagation();
				store.agentEditor.insertNode(nodeId, side);
			},
			[nodeId]
		);

		return (
			<div className={AENButtonsHolder}>
				{hoveredSide === 'left' && (
					<div className={AENButtonLeftSide}>
						<Button
							circle
							data-side="left"
							title="+"
							className={AENButton}
							action={handleAdd}
						/>
					</div>
				)}
				{hoveredSide === 'right' && (
					<div className={AENButtonRightSide}>
						<Button
							data-side="right"
							circle
							title="+"
							className={AENButton}
							action={handleAdd}
						/>
					</div>
				)}
			</div>
		);
	}
);
