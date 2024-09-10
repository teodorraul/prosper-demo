import { fontFace } from "@vanilla-extract/css";

export const InterDisplay = fontFace([
	{
		src: `url('/fonts/InterDisplay-Bold.woff2') format('woff2')`,
		fontWeight: "bold",
		fontStyle: "normal",
		fontDisplay: "swap",
	},
	{
		src: `url('/fonts/InterDisplay-Medium.woff2') format('woff2')`,
		fontWeight: "regular",
		fontStyle: "normal",
		fontDisplay: "swap",
	},
]);

export const Inter = fontFace([
	{
		src: `url('/fonts/Inter-Medium.woff2') format('woff2')`,
		fontWeight: "regular",
		fontStyle: "normal",
		fontDisplay: "swap",
	},
	{
		src: `url('/fonts/Inter-Bold.woff2') format('woff2')`,
		fontWeight: "bold",
		fontStyle: "normal",
		fontDisplay: "swap",
	},
]);
