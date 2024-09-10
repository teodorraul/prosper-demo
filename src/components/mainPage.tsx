import { MainPageStyle } from "./mainPage.css";

export const MainPage: React.FC<{
	children: React.ReactElement | React.ReactElement[];
}> = ({ children }) => {
	return <main className={MainPageStyle}>{children}</main>;
};
