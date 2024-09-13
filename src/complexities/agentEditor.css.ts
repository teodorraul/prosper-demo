import { Colors } from 'src/brand/colors';

import { globalStyle, style } from '@vanilla-extract/css';

export const AgentEditorChartStyle = style({
	background: Colors.background,
});

export const AgentEditorStyle = style({
	width: '100vw',
	height: '100vh',
	display: 'flex',
	flexDirection: 'row',
});

export const AgentEditorHeader = style({
	position: 'fixed',
	left: 15,
	top: 15,
	padding: 8,
	display: 'flex',
	alignItems: 'center',
	zIndex: 1000,
	borderRadius: 15,
	backdropFilter: Colors.panels.blur,
	backgroundColor: Colors.panels.background,
	boxShadow: Colors.panels.shadows,
});

globalStyle(`${AgentEditorHeader} .logo`, {
	height: 27,
	marginLeft: 4,
});
