import { style } from '@vanilla-extract/css';

export const DEPGrid = style({
	display: 'flex',
	alignItems: 'stretch',
	flexDirection: 'column',
	marginTop: 15,
	marginLeft: -5,
});

export const DEPRow = style({
	display: 'grid',
	gridTemplateColumns: 'min-content auto min-content',
	rowGap: 5,
	columnGap: 5,
	borderBottom: '1px solid rgba(0,0,0,0.05)',
	padding: '5px 0',
	':last-child': {
		borderBottom: 'none',
	},
});

export const DEPExpand = style({
	display: 'block',
	flexGrow: 1,
});

export const DEPButton = style({
	display: 'block',
	flexGrow: 0,
});

export const DEPContainer = style({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	marginTop: 20,
});
