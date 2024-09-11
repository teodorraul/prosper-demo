import { observer } from 'mobx-react';
import { CSSProperties, useMemo } from 'react';

import { Handle, NodeProps, Position } from '@xyflow/react';

import {
    aensContainerStyle, aensInnerStyle, aensOutlineStyle
} from './agentEditor.nodes.start.css';

export const AgentEditorNodesStart: React.FC<NodeProps> = observer(
	({ id, data, selected, ...props }) => {
		let outline = useMemo<CSSProperties>(() => {
			return selected ? { display: "block" } : { display: "none" };
		}, [selected]);

		return (
			<div className={aensContainerStyle}>
				<div className={aensInnerStyle}>
					<Handle type="target" position={Position.Left} />
					<div className={aensOutlineStyle} style={outline}></div>
				</div>
			</div>
		);
	}
);
