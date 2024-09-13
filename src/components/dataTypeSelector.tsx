import { capitalize } from 'src/utils/strings';

import {
    DataTypeSelectorContainerStyle, DataTypeSelectorIconStyle, DataTypeSelectorSquareStyle
} from './dataTypeSelector.css';
import { Icon } from './icon';
import { NodeDataExtractsSquareStyle } from './nodeDataExtracts.css';
import { Text } from './text';

export const DataTypeSelector: React.FC<{ value: 'string' }> = ({ value }) => {
	return (
		<div className={DataTypeSelectorContainerStyle}>
			<span
				className={`${NodeDataExtractsSquareStyle} ${DataTypeSelectorSquareStyle}`}
			>
				{value?.[0]}
			</span>
			<Text>{capitalize(value)}</Text>
			<Icon type="selector" className={DataTypeSelectorIconStyle} />
		</div>
	);
};
