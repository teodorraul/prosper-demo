import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const AENPadderStyle = recipe({
	variants: {
		canReceiveEndingNode: {
			true: {
				marginBottom: 200,
			},
		},
	},
});

export const AENContainerStyle = style({
	position: 'relative',
	color: Colors.text.r,
	cursor: 'pointer',
});

export const AENInnerStyle = recipe({
	base: {
		padding: '20px',
		backgroundColor: 'white',
		borderRadius: '14px',
		boxShadow:
			'0 20px 25px -5px rgba(0, 0, 0, 0.16), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
		transition: '0.3s ease box-shadow',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		maxWidth: 270,
		width: '100vw',
	},
	variants: {
		selected: {
			true: {
				boxShadow:
					'0 6px 25px -5px rgba(10, 20, 30, 0.35), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			},
			false: {
				boxShadow:
					'0 5px 5px -5px rgba(0, 0, 0, 0.1), 0 1px 3px 0px rgba(0, 0, 0, 0.1)',
			},
		},
	},
});

export const AEMContextGrid = style({
	display: 'grid',
	gridTemplateColumns: 'min-content 1fr',
	columnGap: 12,
	alignItems: 'flex-start',
	marginTop: 12,
});

export const AENOutlineStyle = recipe({
	base: {
		position: 'absolute',
		top: '-10px',
		left: '-10px',
		height: 'calc(100% + 20px)',
		width: 'calc(100% + 20px)',
		borderColor: 'rgba(0,0,0,0.2)',
		background: Colors.neutralBackground.s2,
		borderWidth: '2px',
		borderStyle: 'solid',
		borderRadius: 'calc(16px + 8px)',
		zIndex: '-10',
	},
	variants: {
		selected: {
			true: {
				display: 'block',
			},
			false: {
				display: 'none',
			},
		},
	},
});
