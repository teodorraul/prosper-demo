import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Button } from 'src/components/button';
import { useClickHandler } from 'src/hooks/useClickHandler';
import { useStore } from 'src/store/useStore';

import { useNodeDetails } from './agentEditorNode.hooks';
import {
	AENButton,
	AENButtonEnding,
	AENButtonLeftSide,
	AENButtonRightSide,
	AENButtonsHolder,
	AENEndingButton,
} from './agentEditorNodeButtons.css';

export const AgentEditorNodeButtons: React.FC<{
	nodeId: string;
	needsEnding: boolean;
}> = observer(({ nodeId, needsEnding }) => {
	const store = useStore();
	const details = useNodeDetails(nodeId);

	const hoveredSide = computed(() =>
		store.agentEditor.hoveredNode?.id == nodeId
			? store.agentEditor.hoveredNode.side
			: undefined
	).get();

	const handleAdd = useClickHandler(
		'side',
		(side: 'left' | 'center' | 'right', ev) => {
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
			{needsEnding && (
				<div className={AENButtonEnding}>
					<Button
						data-side="center"
						circle
						title="Add End Call Node"
						className={AENEndingButton}
						action={handleAdd}
					/>
				</div>
			)}
		</div>
	);
});
