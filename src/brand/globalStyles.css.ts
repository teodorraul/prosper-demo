import { globalStyle } from '@vanilla-extract/css';

import { Inter } from './typography.css';

globalStyle("html, body", {
	margin: 0,
	padding: 0,
	backgroundColor: `#e6eced`,
	WebkitFontSmoothing: "antialiased",
	MozOsxFontSmoothing: "grayscale",
	textRendering: "optimizeLegibility",
	fontSize: 14,
	lineHeight: "21px",
});

globalStyle("body, #root", {
	minWidth: "100vw",
	minHeight: "100vh",
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
});

globalStyle("h1, h2, h3, h4, h5, h6", {
	fontSize: "inherit",
});

globalStyle("*", {
	fontFamily: `${Inter}, sans-serif`,
	boxSizing: "border-box",
});

globalStyle("a", {
	textDecoration: "none",
	color: "currentColor",
});

globalStyle(`*:focus`, {
	outline: "none",
});
