import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const CloseButtonStyle = recipe({
	base: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 16,
		height: 16,
		backgroundColor: 'rgba(0,0,0,0.1)',
		color: Colors.text.r,
		borderRadius: 999,
		cursor: 'pointer',
		marginTop: 6,
		marginLeft: 5,

		':hover': {
			background: 'rgba(0,0,0,0.2)',
		},
		':active': {
			background: 'rgba(0,0,0,0.3)',
		},
	},
});

export const CloseButtonIconStyle = style({
	width: 7,
	height: 7,
});
