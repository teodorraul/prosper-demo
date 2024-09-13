import { observer } from 'mobx-react';
import { Icon } from 'src/components/icon';
import { Text } from 'src/components/text';
import { useStore } from 'src/store/useStore';

import {
	AENRootContainerStyle,
	AENRootHeaderStyle,
	AENRootIconStyle,
} from './agentEditorNodeRootContents.css';

export const AgentEditorNodeRootContents: React.FC<{
	nodeId: string;
}> = observer(({ nodeId }) => {
	const store = useStore();
	const prompt = store.agentEditor.prompt;

	return (
		<div className={AENRootContainerStyle}>
			<div className={AENRootHeaderStyle}>
				<Icon type="phone" className={AENRootIconStyle} />
				<Text level="title" ctx="node">
					Call Start
				</Text>
			</div>
			{prompt ? (
				<Text level="body" ctx="node" pre>
					{prompt}
				</Text>
			) : (
				<Text color="subtle">Start by setting a prompt.</Text>
			)}
		</div>
	);
});
