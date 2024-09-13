import { style } from '@vanilla-extract/css';

export const AENFNodeIcon = style({
	width: 24,
	height: 24,
	alignSelf: 'center',
});

export const AENFNodeContainer = style({
	display: 'flex',
	alignItems: 'stretch',
	flexDirection: 'column',
	textAlign: 'center',
	rowGap: 5,
});

export const AENFNodeSecondContainer = style({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	rowGap: 5,
});
