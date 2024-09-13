import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

export const AENGlobalNodesContainerStyle = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	padding: 0,
	margin: 0,
	marginBottom: 20,
});

export const AENGlobalNodesTitle = style({
	fontSize: 11,
	textTransform: "uppercase",
	opacity: 0.4,
	margin: 0,
	marginTop: 15,
	marginBottom: 10,
});

export const AENRootIconStyle = style({
	width: 22,
	height: 22,
	color: Colors.accent.r,
});

export const AENRootContainerStyle = style({
	display: 'flex',
	alignItems: 'stretch',
	flexDirection: 'column'
})

export const AENRootHeaderStyle = style({
	display: 'flex',
	alignItems: 'center',
	columnGap: 12,
	marginBottom: 10
})