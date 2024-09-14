import { Colors } from 'src/brand/colors';

import { CSSProperties, style } from '@vanilla-extract/css';

export const AENButtonsHolder = style({
	position: 'absolute',
	bottom: 0,
	transform: 'translateY(100%)',
	left: '-15%',
	height: 100,
	width: '130%',
	zIndex: -1,
});

const CommonBeforeStyles: CSSProperties = {
	position: 'absolute',
	top: 0,
	content: '',
	display: 'block',
	width: 30,
	height: 25,
	borderBottom: `1px solid ${Colors.editor.edge}`,
};

export const AENButtonEnding = style({
	position: 'absolute',
	height: 70,
	left: '50%',
	width: 180,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginLeft: -90,
	top: 0,
	':before': {
		top: -10,
		left: '50%',
		width: 1,
		display: 'block',
		content: '',
		position: 'absolute',
		marginLeft: -0.5,
		height: 40,
		backgroundColor: Colors.editor.edge,
	},
});

export const AENButtonLeftSide = style({
	position: 'absolute',
	height: '100%',
	left: '0%',
	width: '50%',
	':before': {
		...CommonBeforeStyles,
		right: 105,
		borderRight: `1px solid ${Colors.editor.edge}`,
		borderBottomRightRadius: '14px',
	},
});

export const AENEndingButton = style({
	width: 80,
	height: 30,
	borderRadius: 7,
	background:
		'linear-gradient(176deg, rgba(255,255,255,1) 0%, rgba(216,224,227,1) 100%)',
	boxShadow: '0px 0px 0px 1px rgba(0,0,0,0.1)',
	color: Colors.text.t2,
	fontSize: 12,
	padding: 0,
	paddingTop: 2,
	':hover': {
		color: Colors.text.r,
		background:
			'linear-gradient(176deg, rgba(240,240,240,1) 0%, rgba(204,211,214,1) 100%)',
	},
	':active': {
		color: Colors.text.r,
		background:
			'linear-gradient(176deg, rgba(233,233,233,1) 0%, rgba(191,199,202,1) 100%)',
	},
});

export const AENButtonRightSide = style({
	position: 'absolute',
	height: '100%',
	left: '50%',
	width: '50%',
	':before': {
		...CommonBeforeStyles,
		left: 105,
		borderLeft: `1px solid ${Colors.editor.edge}`,
		borderBottomLeftRadius: '14px',
	},
});

export const AENButton = style({
	position: 'absolute',
	selectors: {
		[`${AENButtonRightSide} &`]: {
			left: 135,
			top: 10,
		},
		[`${AENButtonLeftSide} &`]: {
			right: 135,
			top: 10,
		},
	},
});
