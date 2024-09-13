import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

export const AgentEditorSyncingBarStyle = style({
	padding: '5px 12px',
	position: 'fixed',
	bottom: 20,
	left: 20,
	borderRadius: 10,
	color: 'white',
	backgroundColor: Colors.text.r,
	boxShadow: Colors.panels.shadows,
});
