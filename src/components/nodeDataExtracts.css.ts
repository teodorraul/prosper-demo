import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

export const NodeDataExtractsContainerStyle = style({
	marginTop: 8,
	color: Colors.text.t2,
	backgroundColor: "rgba(10,20,30,0.05)",
	borderRadius: 7,
	padding: 10,
	margin: "15px -10px -10px -10px",
});

export const NodeDataExtractsRowStyle = style({
	display: "flex",
	alignItems: "center",
});

export const NodeDataExtractsSquareStyle = style({
	marginTop: 8,
	width: 16,
	boxShadow: "0px 0px 0px 0.5px inset rgba(20,35,50,0.25)",
	height: 16,
	borderRadius: 4,
	display: "flex",
	backgroundColor: "#AEFFC5",
	color: "#288C44",
	alignItems: "center",
	justifyContent: "center",
	marginRight: 10,
	fontFamily: "monospace",
	fontSize: 12,
});

export const NodeDataExtractsLabelStyle = style({
	marginTop: 8,
	color: Colors.text.t1,
	fontSize: 12,
	lineHeight: "1em",
});
