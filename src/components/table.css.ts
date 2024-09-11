import { Colors } from 'src/brand/colors';

import { style } from '@vanilla-extract/css';

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

export const TableCellStyle = style({
	padding: 12,

	selectors: {
		[`${TableRowStyle}:nth-child(odd) &`]: {
			backgroundColor: Colors.background.t1,
		},
		[`${TableRowStyle}:hover &`]: {
			backgroundColor: Colors.background.s1,
		},
		[`${TableRowStyle}:active &`]: {
			backgroundColor: Colors.background.s2,
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
});

export const TableStyle = style({
	display: "grid",
});
