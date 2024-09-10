import { Outlet } from "react-router-dom";
import { Sidebar } from "src/components/sidebar";
import { IndexRoutesContainerStyles } from "./index.css";

export const IndexRoutesContainer = () => {
	return (
		<div className={IndexRoutesContainerStyles}>
			<Sidebar />
			<Outlet />
		</div>
	);
};
