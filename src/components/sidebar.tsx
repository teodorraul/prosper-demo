import { Logo } from "./logo";
import {
	LogoHolderStyle,
	SidebarLinkStyle,
	SidebarNavStyle,
	SidebarStyle,
} from "./sidebar.css";
import "../brand/globalStyles.css";

export const Sidebar = () => {
	return (
		<aside className={SidebarStyle}>
			<div className={LogoHolderStyle}>
				<Logo />
			</div>
			<nav className={SidebarNavStyle}>
				<a href="/" className={SidebarLinkStyle({ active: true })}>
					🧑‍💼 Agents
				</a>
				<a href="/" className={SidebarLinkStyle()}>
					Another page (TBD)
				</a>
			</nav>
		</aside>
	);
};
