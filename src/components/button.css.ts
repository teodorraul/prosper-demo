import { Colors } from 'src/brand/colors';

import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const slideSize = '20px';
const slide = keyframes({
	'0%': { transform: `translateX(-${slideSize})` },
	'100%': { transform: 'translateX(100%)' },
});

export const LoaderStyle = style({
	position: 'absolute',
	width: '100%',
	left: 0,
	top: 0,
	height: '100%',
	background: 'transparent',
	animationName: slide,
	animationDuration: '0.6s',
	animationIterationCount: 'infinite',

	':before': {
		display: 'block',
		content: '',
		position: 'absolute',
		top: 0,
		left: 0,
		width: slideSize,
		height: '100%',
		backgroundColor: 'currentcolor',
		filter: 'blur(1px)',
	},
});

export const LoaderMaskStyle = recipe({
	base: {
		position: 'absolute',
		width: 'calc(100% - 20px)',
		left: 10,
		top: '50%',
		height: 3,
		background: 'rgba(255,255,255,0.2)',
		transform: 'translateY(-50%)',
		borderRadius: 4,
		overflow: 'hidden',
	},
	variants: {
		type: {
			textualDanger: {
				left: '24px',
				width: 'calc(100% - 48px)',
			},
			primary: {},
			subtlePrimary: {},
			subtle: {},
		},
	},
});

export const ButtonStyle = recipe({
	base: {
		backgroundColor: 'white',
		boxShadow: '0px 2px 4px rgba(0,0,0, 0.2)',
		flexGrow: 1,
		borderRadius: 12,
		padding: '6px 14px',
		border: 'none',
		fontSize: '13px',
		cursor: 'pointer',
		position: 'relative',
	},
	variants: {
		align: {
			center: {
				textAlign: 'center',
			},
			normal: {},
		},
		type: {
			primary: {
				backgroundColor: Colors.main.r,
				color: '#fff',
				'&:hover': {
					backgroundColor: Colors.main.s1,
				},
				'&:active': {
					backgroundColor: Colors.main.s2,
				},
			},
			textualDanger: {
				backgroundColor: 'rgba(0,0,0,0.0)',
				boxShadow: 'none',
				color: 'red',
				margin: '-6px -14px',
				'&:hover': {
					color: 'darkRed',
				},
			},
			subtlePrimary: {
				backgroundColor: Colors.subtleMain.r,
				color: Colors.main.r,
				boxShadow: 'none',
				'&:hover': {
					backgroundColor: Colors.subtleMain.s1,
				},
				'&:active': {
					backgroundColor: Colors.subtleMain.s2,
				},
			},
			subtle: {
				backgroundColor: 'rgba(0,0,0,0.0)',
				color: '#000',
				boxShadow: 'none',
				'&:hover': {
					backgroundColor: 'rgba(0,0,0,0.05)',
				},
				'&:active': {
					backgroundColor: 'rgba(0,0,0,0.1)',
				},
			},
		},
		shape: {
			normal: {},
			circle: {
				width: 32,
				height: 32,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 999,
			},
		},
	},
});
