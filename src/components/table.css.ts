import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const TableHStyle = style({
	fontSize: "13px",
	textTransform: "uppercase",
	color: "rgba(0,0,0,0.25)",
	paddingBottom: "10px",
});

export const TableRowStyle = style({
	display: "contents",
	cursor: "pointer",
});

export const TableCellStyle = recipe({
	base: {
		padding: 12,
		display: "flex",
		alignItems: "stretch",
		flexDirection: "column",
		selectors: {
			[`${TableRowStyle}:nth-child(odd) &`]: {
				backgroundColor: "rgba(0,0,0,0.035)",
			},
			[`${TableRowStyle}:hover &`]: {
				backgroundColor: Colors.background.r,
			},
			[`${TableRowStyle}:active &`]: {
				backgroundColor: Colors.background.s1,
			},
			[`&:first-child`]: {
				borderTopLeftRadius: 8,
				borderBottomLeftRadius: 8,
			},
			[`&:last-child`]: {
				borderTopRightRadius: 8,
				borderBottomRightRadius: 8,
			},
		},
	},
	variants: {
		layout: {
			normal: {},
			oneLine: {
				whiteSpace: "nowrap",
				overflow: "hidden",
				textOverflow: "ellipsis",
			},
		},
	},
});

export const TableStyle = style({
	display: "grid",
});
