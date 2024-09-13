import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

export const AgentEditorSyncingBarStyle = style({
	padding: '5px 12px',
	position: 'fixed',
	top: 20,
	right: 20,
	borderRadius: 10,
	backdropFilter: Colors.panels.blur,
	backgroundColor: Colors.panels.background,
	boxShadow: Colors.panels.shadows,
});
