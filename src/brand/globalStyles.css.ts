import { globalStyle } from "@vanilla-extract/css";
import { Inter } from "./typography.css";

globalStyle("html, body", {
	margin: 0,
	padding: 0,
	backgroundColor: `#e6eced`,
	fontFamily: Inter,
	WebkitFontSmoothing: "antialiased",
	MozOsxFontSmoothing: "grayscale",
	textRendering: "optimizeLegibility",
	fontSize: 14,
});

globalStyle("a", {
	textDecoration: "none",
	color: "currentColor",
});
