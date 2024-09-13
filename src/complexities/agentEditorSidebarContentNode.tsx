import { observer } from 'mobx-react';
import { useCallback } from 'react';
import { DataExtractionPanel } from 'src/components/dataExtractionPanel';
import { NodeIf } from 'src/components/nodeIf';
import { Text } from 'src/components/text';
import { Textbox } from 'src/components/textbox';
import { useStore } from 'src/store/useStore';

import { useNodeDetails } from './agentEditorNode.hooks';
import {
	AgentEditorSidebarCardStyle,
	AgentEditorSidebarIndentedTextStyle,
} from './agentEditorSidebar.css';
import {
	AESCNodeConditionStyle,
	AESCNodeNodeNameStyle,
} from './agentEditorSidebarContentNode.css';

export const AESCNode: React.FC<{ nodeId: string }> = observer(({ nodeId }) => {
	const store = useStore();
	const details = useNodeDetails(nodeId);
	const handleDelayedNameChange = useCallback((value: string) => {
		store.agentEditor.updateNode(nodeId, {
			node_name: value,
		});
	}, []);

	const handleDelayedConditionChange = useCallback((value: string) => {
		store.agentEditor.updateNode(nodeId, {
			node_enter_condition: value,
		});
	}, []);

	return (
		<>
			<div className={AgentEditorSidebarCardStyle}>
				<Text level="microtitle" color="subtle">
					Function Name
				</Text>
				<Textbox
					className={AESCNodeNodeNameStyle}
					remoteValue={details?.nodeName}
					placeholder="Describe the agent's characteristics, i.e. where she's working it, etc."
					autofocusIfEmpty
					onDelayedChange={handleDelayedNameChange}
				/>
			</div>
			<div className={AgentEditorSidebarCardStyle}>
				<NodeIf expanded />
				<Textbox
					area
					className={`${AESCNodeConditionStyle}`}
					remoteValue={details?.nodeEnterCondition}
					placeholder="Describe the agent's characteristics, i.e. where she's working it, etc."
					autofocusIfEmpty
					onDelayedChange={handleDelayedConditionChange}
				/>
			</div>
			<div className={AgentEditorSidebarIndentedTextStyle}>
				<Text level="tiny" color="subtle">
					TIP: Start with "If the user says" and end with ", call this
					function.
				</Text>
			</div>
			<DataExtractionPanel userData={details?.userData} />
			<div />
		</>
	);
});
