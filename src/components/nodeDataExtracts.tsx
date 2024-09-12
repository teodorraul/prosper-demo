import { AgentEditorNodeUserData } from 'src/store/agents.types';
import { capitalize } from 'src/utils/strings';

import {
    NodeDataExtractsContainerStyle, NodeDataExtractsLabelStyle, NodeDataExtractsRowStyle,
    NodeDataExtractsSquareStyle
} from './nodeDataExtracts.css';
import { Text } from './text';

export const NodeDataExtracts: React.FC<{
	items: AgentEditorNodeUserData[] | undefined;
}> = ({ items = [] }) => {
	return (
		<div className={NodeDataExtractsContainerStyle}>
			<Text level="microtitle">Extract Data</Text>
			{items.map((n) => {
				return (
					<div className={NodeDataExtractsRowStyle}>
						<span className={NodeDataExtractsSquareStyle}>
							{n.dataType[0]}
						</span>
						<span className={NodeDataExtractsLabelStyle}>
							{capitalize(n.name.replaceAll("_", " "))}
						</span>
					</div>
				);
			})}
		</div>
	);
};
