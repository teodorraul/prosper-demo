import { ReactElement } from 'react';

import { RecipeVariants } from '@vanilla-extract/recipes';

import { TextStyle } from './text.css';

export const Text: React.FC<
	{
		children: ReactElement | string;
	} & RecipeVariants<typeof TextStyle>
> = ({
	level = "body",
	children,
	oneLine,
	color = "text",
	ctx = "default",
}) => {
	return (
		<p className={TextStyle({ level, oneLine, ctx, color })}>{children}</p>
	);
};
