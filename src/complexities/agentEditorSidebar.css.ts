import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

export const AgentEditorSidebarContainerStyle = style({
	width: "50vw",
	maxWidth: 500,
	position: "fixed",
	bottom: 0,
	right: 0,
});

export const AgentEditorSidebarStyle = style({
	margin: 40,
	padding: 10,
	borderRadius: 20,
	willChange: "transform",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	rowGap: 10,
	backdropFilter: Colors.panels.blur,
	backgroundColor: "rgba(207,219,222, 0.85)",
	boxShadow: Colors.panels.shadows,
});

export const AgentEditorSidebarTitleStyle = style({
	backgroundColor: "rgba(10,20,30,0.1)",
	padding: "5px 10px",
	textTransform: "uppercase",
	borderRadius: "10px",
	fontSize: "10px",
	letterSpacing: "0.2px",
	lineHeight: "1em",
	margin: 0,
});

export const AgentEditorSidebarCardStyle = style({
	backgroundColor: "white",
	padding: "10px",
	textTransform: "uppercase",
	borderRadius: "10px",
	boxShadow: "0px 3px 7px rgba(0,0,0,0.2)",
	alignSelf: "stretch",
});
