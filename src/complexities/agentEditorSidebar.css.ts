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
	margin: 20,
	marginBottom: 0,
	padding: '10px 15px',
	paddingBottom: 17,
	borderRadius: '20px 20px 0 0',
	willChange: "transform",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	rowGap: 10,
	backdropFilter: Colors.panels.blur,
	backgroundColor: "rgba(207,219,222, 0.85)",
	boxShadow: Colors.panels.shadows,
});

export const AgentEditorSidebarTitleStyle = style({
	backgroundColor: Colors.main.r,
	padding: "5px 10px",
	textTransform: "uppercase",
	borderRadius: "10px",
	fontSize: "10px",
	letterSpacing: "0.2px",
	lineHeight: "1em",
	margin: 0,
	marginTop: 5,
	color: '#fff'
});

export const AgentEditorSidebarCardStyle = style({
	backgroundColor: "white",
	padding: "20px",
	textTransform: "uppercase",
	borderRadius: "16px",
	boxShadow: "0px 2px 3px rgba(10,20,30,0.1), 0px 1px 2px 1px rgba(10,20,30,0.1)",
	alignSelf: "stretch",
});
