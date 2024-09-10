import { Logo } from "./logo";
import {
	LogoHolderStyle,
	SidebarLinkStyle,
	SidebarNavStyle,
	SidebarStyle,
} from "./sidebar.css";
import "../brand/globalStyles.css";
import { Link, NavLink } from "react-router-dom";

const routes = [
	{
		path: "/agents",
		name: "🧑‍💼 Agents",
	},
	{ path: "another-page", name: "Another page (TBD)" },
];
export const Sidebar = () => {
	return (
		<aside className={SidebarStyle}>
			<div className={LogoHolderStyle}>
				<Logo />
			</div>
			<nav className={SidebarNavStyle}>
				{routes.map((r) => (
					<NavLink
						key={r.path}
						to={r.path}
						className={({ isActive }) =>
							isActive
								? SidebarLinkStyle({ active: true })
								: SidebarLinkStyle()
						}
					>
						{r.name}
					</NavLink>
				))}
			</nav>
		</aside>
	);
};
