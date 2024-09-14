import { Colors } from 'src/brand/colors';

import { globalStyle, style } from '@vanilla-extract/css';

export const AgentEditorChartStyle = style({
	background: Colors.background,
	background: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(0,0,0,0.05)), url(https://grainy-gradients.vercel.app/noise.svg); `,
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

export const AgentEditorDisablingOverlay = style({
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	zIndex: Colors.zIndexes.overlay,
	background: 'rgba(0,0,0,0)',
	//debug
	// backgroundColor: 'red',
});
