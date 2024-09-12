import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

export const AENGlobalRowStyle = style({
	display: "flex",
	flexDirection: "column",
	borderBottom: `1px solid rgba(0,0,0,0.1)`,
	marginBottom: "10px",
	paddingBottom: "10px",

	":last-child": {
		borderBottom: "none",
		marginBottom: 0,
		paddingBottom: 0,
	},
});

export const AENGlobalRowTitleStyle = style({
	margin: 0,
	fontSize: 13,
});

export const AENGlobalRowDescriptionStyle = style({
	whiteSpace: "nowrap",
	overflow: "hidden",
	textOverflow: "ellipsis",
	margin: 0,
	maxWidth: 250,
	fontSize: 13,
	color: Colors.text.t2,
});
