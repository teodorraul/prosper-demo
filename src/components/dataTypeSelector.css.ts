import { style } from '@vanilla-extract/css';

export const DataTypeSelectorContainerStyle = style({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	padding: '3px 6px',
	borderRadius: 8,
	flexGrow: 1,

	':hover': {
		background: 'rgba(0,0,0,0.05)',
		cursor: 'pointer',
	},
	':active': {
		background: 'rgba(0,0,0,0.1)',
		cursor: 'pointer',
	},
});
export const DataTypeSelectorSquareStyle = style({
	marginRight: 5,
});

export const DataTypeSelectorIconStyle = style({
	width: 8,
	marginLeft: 5,
	opacity: 0.3,

	selectors: {
		[`${DataTypeSelectorContainerStyle}:hover &`]: {
			opacity: 1,
		},
	},
});
