import { observer } from 'mobx-react';
import { Colors } from 'src/brand/colors';

import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export const AgentEditorEdge = observer(
	({
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		style = {},
		selected,
		markerEnd,
	}: EdgeProps) => {
		const [edgePath, labelX, labelY] = getSmoothStepPath({
			sourceX,
			sourceY,
			sourcePosition,
			targetX,
			targetY,
			targetPosition,
			borderRadius: 20,
		});

		return (
			<g className="prevent-selection-loss">
				<BaseEdge
					path={edgePath}
					markerEnd={markerEnd}
					interactionWidth={20}
					style={{
						...style,
						stroke: Colors.editor.edge,
					}}
				/>
			</g>
		);
	}
);
