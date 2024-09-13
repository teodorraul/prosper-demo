import { ReactElement } from 'react';

import { RecipeVariants } from '@vanilla-extract/recipes';

import { TextStyle } from './text.css';

export const Text: React.FC<
	{
		children: ReactElement | string;
		pre: boolean;
	} & RecipeVariants<typeof TextStyle>
> = ({
	level = 'body',
	children,
	oneLine,
	pre,
	color = 'text',
	ctx = 'default',
}) => {
	return (
		<p className={TextStyle({ level, oneLine, ctx, color, pre })}>
			{children}
		</p>
	);
};
