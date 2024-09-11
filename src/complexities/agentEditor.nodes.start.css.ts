import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

export const aensContainerStyle = style({
	position: "relative",
	color: "white",
});

export const aensInnerStyle = style({
	padding: "16px",
	backgroundColor: Colors.background.r,
	borderRadius: "16px",
	boxShadow:
		"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
});

export const aensOutlineStyle = style({
	position: "absolute",
	top: "-4px",
	left: "-4px",
	height: "calc(100% + 8px)",
	width: "calc(100% + 8px)",
	borderColor: Colors.accent.r,
	borderWidth: "1px",
	borderStyle: "solid",
	borderRadius: "calc(16px + 4px)",
	zIndex: "-10",
});
