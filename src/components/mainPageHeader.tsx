import { ReactNode } from 'react';

import { MainPageHeaderStyle } from './mainPageHeader.css';
import { Text } from './text';

export const MainPageHeader: React.FC<{
	title: string;
	actions: ReactNode;
}> = ({ title, actions }) => {
	return (
		<header className={MainPageHeaderStyle}>
			<Text level="title">{title}</Text>
			<div>{actions}</div>
		</header>
	);
};
