import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { useStore } from 'src/store/useStore';

import { Handle, NodeProps, Position } from '@xyflow/react';

import { AENContainerStyle, AENInnerStyle, AENOutlineStyle } from './agentEditorNode.css';
import { useNodeDetails } from './agentEditorNode.hooks';
import { AgentEditorNodeButtons } from './agentEditorNodeButtons';
import { AgentEditorNodeContents } from './agentEditorNodeContents';
import { AgentEditorNodeFinalContents } from './agentEditorNodeFinalContents';
import { AgentEditorNodeRootContents } from './agentEditorNodeRootContents';

export const AgentEditorNode: React.FC<NodeProps> = observer(
	({ id: nodeId, data, selected: rfSelected, ...props }) => {
		const details = useNodeDetails(nodeId);
		const store = useStore();

		const selected = store.agentEditor.selectedNode === nodeId;

		const contents = useMemo(() => {
			switch (details?.nodeType) {
				case 'start_call':
					return <AgentEditorNodeRootContents nodeId={nodeId} />;
				case 'end_call':
					return <AgentEditorNodeFinalContents nodeId={nodeId} />;
				case 'default':
					return (
						<AgentEditorNodeContents
							node={details}
							nodeId={nodeId}
						/>
					);
				case 'global':
					return <></>;
				case undefined:
					return <></>;
				default:
					console.log('nono', details?.nodeType);
					throw new Error(
						'unsupported node type: ' + details?.nodeType
					);
			}
		}, [details?.nodeType, nodeId]);

		return (
			<div
				className={`${AENContainerStyle} rendered-node`}
				data-node-id={nodeId}
			>
				<div className={AENInnerStyle({ selected })}>
					<Handle
						type="source"
						position={Position.Bottom}
						style={{ visibility: 'hidden' }}
					/>
					{contents}
					<div className={AENOutlineStyle({ selected })} />
					<Handle
						type="target"
						position={Position.Top}
						style={{ visibility: 'hidden' }}
					/>
					<AgentEditorNodeButtons nodeId={nodeId} />
				</div>
			</div>
		);
	}
);
