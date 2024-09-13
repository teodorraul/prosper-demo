import { Colors } from 'src/brand/colors';
import { Playfair } from 'src/brand/typography.css';

import { style } from '@vanilla-extract/css';

export const AgentEditorSidebarContainerStyle = style({
	width: '50vw',
	maxWidth: 500,
	height: '100vh',
	position: 'fixed',
	top: 0,
	right: 0,
	display: 'flex',
	flexDirection: 'column',
});

export const AgentEditorSidebarStyle = style({
	margin: 20,
	padding: '25px 35px',
	paddingBottom: 17,
	borderRadius: '20px',
	willChange: 'transform',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	rowGap: 10,
	flexGrow: 1,
	overflow: 'scroll',
	backdropFilter: Colors.panels.blur,
	backgroundColor: 'rgba(217,229,232, 0.85)',
	boxShadow:
		'0px 0px 0px 0.5px inset rgba(20,35,50,0.33), 0 15px 30px -10px rgba(40,50,60,0.6)',
});

export const AgentEditorSidebarTitleStyle = style({
	fontSize: '43px',
	fontFamily: Playfair,
	letterSpacing: '-0.75px',
	lineHeight: '1.1em',
	margin: 5,
	marginBottom: 12,
	color: Colors.text.r,
});

export const AgentEditorSidebarCardStyle = style({
	backgroundColor: 'white',
	padding: '16px 20px 12px 20px',
	textTransform: 'uppercase',
	borderRadius: '16px',
	boxShadow:
		'0px 2px 3px rgba(10,20,30,0.1), 0px 1px 2px 1px rgba(10,20,30,0.1)',
	alignSelf: 'stretch',
});

export const AgentEditorSidebarIndentedTextStyle = style({
	padding: '3px 5px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	rowGap: 8,
});
