import { observer } from 'mobx-react';
import { useCallback } from 'react';
import { useNodeDetails } from 'src/complexities/agentEditorNode.hooks';
import { useClickHandler } from 'src/hooks/useClickHandler';
import { AgentEditorNodeUserData, RemoteAgentEditorNodeUserData } from 'src/store/agents.types';
import { useStore } from 'src/store/useStore';
import { MTSNEReturnDataExtractionId } from 'src/utils/methodsThatShouldNotExist';
import { v4 as uuid } from 'uuid';

import { Button } from './button';
import { CloseButton } from './closeButton';
import { DEPButton, DEPContainer, DEPExpand, DEPGrid, DEPRow } from './dataExtractionPanel.css';
import { DataTypeSelector } from './dataTypeSelector';
import { Text } from './text';
import { Textbox } from './textbox';

export const DataExtractionPanel: React.FC<{
	nodeId: string;
	userData?: AgentEditorNodeUserData[] | undefined;
}> = observer(({ userData, nodeId }) => {
	let hasData = userData?.length > 0;
	const store = useStore();
	const node = useNodeDetails(nodeId);

	const handleClick = useCallback(() => {
		store.agentEditor.updateNode(nodeId, {
			user_data: [
				{
					id: uuid(),
					data_type: 'string',
					name: '',
					description: '',
				},
				...(node?.serializedUserDataForSupa || []),
			],
		});
	}, [nodeId, node]);

	const handleCloseClick = useClickHandler(
		'id',
		(id) => {
			store.agentEditor.updateNode(nodeId, {
				user_data: [
					...(node?.serializedUserDataForSupa || []).filter(
						(n) => MTSNEReturnDataExtractionId(n) != id
					),
				],
			});
		},
		[]
	);

	const handleNameChange = useCallback(
		(value, ref) => {
			let dataIdThatChanged = ref?.getAttribute('data-id');
			let field = ref?.getAttribute('data-field');

			if (dataIdThatChanged) {
				let data = node?.serializedUserDataForSupa;
				if (data) {
					var existingData:
						| undefined
						| RemoteAgentEditorNodeUserData = undefined;
					for (const n of data) {
						if (
							MTSNEReturnDataExtractionId(n) == dataIdThatChanged
						) {
							existingData = n;
						}
					}

					if (existingData) {
						let restOfData = data.filter(
							(o) =>
								MTSNEReturnDataExtractionId(o) !=
								dataIdThatChanged
						);
						store.agentEditor.updateNode(nodeId, {
							user_data: [
								{
									...existingData,
									[field]: value,
								},
								...(restOfData || []),
							],
						});
					}
				}
			}
		},
		[node]
	);

	return (
		<div className={DEPContainer}>
			<Text level="smallTitle" color={hasData ? 'text' : 'barelyVisible'}>
				{hasData ? 'Data Extraction:' : ''}
			</Text>
			<div className={DEPGrid}>
				{userData?.map((u) => {
					let serialized = u.serializedForSupa;
					return (
						<div
							className={DEPRow}
							key={MTSNEReturnDataExtractionId(u)}
						>
							<DataTypeSelector value={u.dataType} />
							<Textbox
								data-id={MTSNEReturnDataExtractionId(
									serialized
								)}
								data-field="name"
								onDelayedChange={handleNameChange}
								placeholder="Variable name"
								context="editorSidebar"
								remoteValue={u.name}
							/>
							<CloseButton
								onClick={handleCloseClick}
								data-id={MTSNEReturnDataExtractionId(
									serialized
								)}
							/>
							<span />
							<Textbox
								data-field="description"
								data-id={MTSNEReturnDataExtractionId(
									serialized
								)}
								placeholder="Describe the extracted data"
								context="editorSidebar"
								area
								remoteValue={u.description}
							/>
							<span />
						</div>
					);
				})}
			</div>
			<div className={DEPExpand} />
			<Button
				action={handleClick}
				title="+ New Data Extraction"
				className={DEPButton}
				center
			/>
		</div>
	);
});
