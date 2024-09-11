import { Colors } from 'src/brand/colors';

import { globalStyle, style } from '@vanilla-extract/css';

export const AgentEditorChartStyle = style({
    background: Colors.background.t1
})


export const AgentEditorStyle = style({
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row'
})

export const AgentEditorHeader = style({
    position: 'fixed',
    left: 20,
    top: 20,
    padding: 8,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
    borderRadius: 10,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.08)'
})

globalStyle(`${AgentEditorHeader} .logo`, {
    height: 28,
    marginLeft: 8
});

export const AgentEditorSidebar = style({
    width: '40vw',
    backgroundColor: 'white',
    borderLeft: '1px solid rgba(0,0,0,0.15)'
})