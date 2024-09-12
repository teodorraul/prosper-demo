import { Colors } from 'src/brand/colors';

import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const slide = keyframes({
	"0%": { transform: `rotate(0deg)` },
	"100%": { transform: "rotate(360deg)" },
});

export const LoaderStyle = recipe({
	base: {
		width: 24,
		height: 24,
		border: `2.5px solid ${Colors.background.r}`,
		borderTop: `2.5px solid ${Colors.accent.r}`,
		borderRadius: "50%",
		animationName: slide,
		animationDuration: "0.8s",
		animationIterationCount: "infinite",
	},
	variants: {
		size: {
			small: {
				width: 24,
				height: 24,
			},
			medium: {
				width: 42,
				height: 42,
				borderWidth: 4,
			},
			large: {
				width: 72,
				height: 72,
				borderWidth: 6,
			},
		},
	},
});

export const LoaderContainerStyle = style({
	display: "flex",
	width: "100%",
	height: "100%",
	alignItems: "center",
	flexGrow: 1,
	justifyContent: "center",
});
