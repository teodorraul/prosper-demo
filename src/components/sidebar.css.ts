import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const SidebarStyle = style({
	background: "transparent",
	width: "300px",
	minHeight: "100vh",
	padding: "30px 30px",
	display: "flex",
	flexDirection: "column",
	alignItems: "stretch",
	flexShrink: 0,
});

export const LogoHolderStyle = style({
	width: 130,
	marginBottom: 20,
});

export const SidebarLinkStyle = recipe({
	base: {
		padding: "6px 10px 9px 15px",
		borderRadius: 10,
		minHeight: 40,
		display: "flex",
		alignItems: "center",
	},
	variants: {
		active: {
			true: {
				backgroundColor: "#d5e0e2",
				cursor: "default",
			},
		},
	},
});

export const SidebarNavStyle = style({
	marginBottom: 20,
	marginLeft: -10,
	display: "flex",
	alignItems: "stretch",
	flexDirection: "column",
});
