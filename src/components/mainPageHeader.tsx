import { ReactNode } from "react";
import { MainPageHeaderStyle } from "./mainPageHeader.css";

export const MainPageHeader: React.FC<{
	title: string;
	actions: ReactNode;
}> = ({ title, actions }) => {
	return (
		<header className={MainPageHeaderStyle}>
			<h1>{title}</h1>
			<div>{actions}</div>
		</header>
	);
};
