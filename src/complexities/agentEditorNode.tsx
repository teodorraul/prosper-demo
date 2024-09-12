import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from 'src/store/useStore';

import { Handle, NodeProps, Position } from '@xyflow/react';

import { AENContainerStyle, AENInnerStyle, AENOutlineStyle } from './agentEditorNode.css';
import { useNode } from './agentEditorNode.hooks';
import { AgentEditorNodeContents } from './agentEditorNodeContents';
import { AgentEditorNodeFinalContents } from './agentEditorNodeFinalContents';
import { AgentEditorNodeRootContents } from './agentEditorNodeRootContents';

export const AgentEditorNode: React.FC<NodeProps> = observer(
	({ id: nodeId, data, selected: rfSelected, ...props }) => {
		const { id: agentId } = useParams();

		const node = useNode(agentId, nodeId);
		const store = useStore();

		const selected = store.agentEditor.selectedNode === nodeId;

		const contents = useMemo(() => {
			if (!agentId) throw new Error('found null agentid');

			switch (node?.nodeType) {
				case 'start_call':
					return (
						<AgentEditorNodeRootContents
							agentId={agentId}
							nodeId={nodeId}
						/>
					);
				case 'end_call':
					return (
						<AgentEditorNodeFinalContents
							agentId={agentId}
							nodeId={nodeId}
						/>
					);
				case 'default':
					return (
						<AgentEditorNodeContents
							agentId={agentId}
							nodeId={nodeId}
						/>
					);
				case 'global':
					return <></>;
				case undefined:
					return <></>;
				default:
					console.log('nono', node?.nodeType);
					throw new Error('unsupported node type: ' + node?.nodeType);
			}
		}, [node?.nodeType, agentId, nodeId]);

		return (
			<div className={AENContainerStyle} data-node-id={nodeId}>
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
				</div>
			</div>
		);
	}
);
