import { Colors } from 'src/brand/colors';

import { keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const slideSize = "20px";
const slide = keyframes({
	"0%": { transform: `translateX(-${slideSize})` },
	"100%": { transform: "translateX(100%)" },
});

export const LoaderStyle = style({
	position: "absolute",
	width: "100%",
	left: 0,
	top: 0,
	height: "100%",
	background: "transparent",
	animationName: slide,
	animationDuration: "0.6s",
	animationIterationCount: "infinite",

	":before": {
		display: "block",
		content: "",
		position: "absolute",
		top: 0,
		left: 0,
		width: slideSize,
		height: "100%",
		backgroundColor: "white",
		filter: "blur(1px)",
	},
});

export const LoaderMaskStyle = style({
	position: "absolute",
	width: "calc(100% - 20px)",
	left: 10,
	top: "50%",
	height: 3,
	background: "rgba(255,255,255,0.2)",
	transform: "translateY(-50%)",
	borderRadius: 4,
	overflow: "hidden",
});

export const ButtonStyle = recipe({
	base: {
		backgroundColor: "white",
		boxShadow: "0px 2px 4px rgba(0,0,0, 0.2)",
		flexGrow: 1,
		borderRadius: 12,
		padding: "8px 16px",
		border: "none",
		fontSize: "13px",
		cursor: "pointer",
		position: "relative",
	},
	variants: {
		type: {
			primary: {
				backgroundColor: Colors.main.r,
				color: "#fff",
				"&:hover": {
					backgroundColor: Colors.main.s1,
				},
				"&:active": {
					backgroundColor: Colors.main.s2,
				},
			},
		},
	},
});
