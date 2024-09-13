import { AgentEditorNodeUserData } from 'src/store/agents.types';

import { Button } from './button';
import { DEPGrid } from './dataExtractionPanel.css';
import { NodeDataExtractsSquareStyle } from './nodeDataExtracts.css';
import { Text } from './text';

export const DataExtractionPanel: React.FC<{
	userData?: AgentEditorNodeUserData[] | undefined;
}> = ({ userData }) => {
	return (
		<>
			<Button title="Add Data Extraction" />
			{userData?.map((u) => {
				return (
					<div className={DEPGrid}>
						<span className={NodeDataExtractsSquareStyle}>
							{u.dataType[0]}
						</span>
						<Text>{u.name}</Text>
						<Text>{u.description}</Text>
					</div>
				);
			})}
		</>
	);
};
