import { Inter } from 'src/brand/typography.css';

import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const TextboxStyle = recipe({
	base: {
		margin: 0,
		padding: 0,
		border: 'none',
		width: '100%',
		fontSize: 13,
		fontFamily: Inter,
		backgroundColor: 'transparent',
		paddingBottom: 10,
		resize: 'vertical',
		lineHeight: '1.5em',
	},
	variants: {
		context: {
			default: {},
			editorSidebar: {
				borderRadius: 8,
				padding: '8px 15px',
				':hover': {
					background: 'rgba(0,0,0,0.05)',
				},
				':active': {
					background: 'rgba(0,0,0,0.1)',
				},
				':focus': {
					background: 'rgba(0,0,0,0.1)',
				},
			},
			editorSidebarCard: {},
		},
	},
});

export const TextFieldStyle = recipe({
	base: {
		margin: 0,
		padding: '7px 0',
		border: 'none',
		width: '100%',
		fontSize: 13,
		backgroundColor: 'transparent',
		fontFamily: Inter,
		lineHeight: '1em',
	},
	variants: {
		context: {
			default: {},
			editorSidebar: {
				borderRadius: 8,
				padding: '8px 15px',
				fontWeight: 'bold',
				background: 'rgba(0,0,0,0.05)',
				':hover': {
					background: 'rgba(0,0,0,0.1)',
				},
				':active': {
					background: 'rgba(0,0,0,0.1)',
				},
				':focus': {
					background: 'rgba(0,0,0,0.1)',
				},
			},
			editorSidebarCard: {},
		},
	},
});

const Breath = keyframes({
	'0%': { opacity: 1 },
	'20%': { opacity: 1 },
	'43%': { opacity: 0.33 },
	'50%': { opacity: 0.33 },
	'60%': { opacity: 0.33 },
	'80%': { opacity: 1 },
	'100%': { opacity: 1 },
});

export const TextboxContainerStyle = style({
	position: 'relative',

	// ':before': {
	//     content: "",
	//     display: 'block',
	//     position: 'absolute',
	//     bottom: -4,
	//     height: 2,
	//     width: '100%',
	//     borderRadius: 99,
	//     left: 0,
	//     background: Colors.accent.r,
	// 	animationName: Breath,
	// 	animationDuration: "4s",
	// 	animationIterationCount: "infinite",
	// }
});
