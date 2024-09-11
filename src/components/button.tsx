import { HTMLAttributes, useCallback, useMemo, useState } from "react";
import { Link, LinkProps } from "react-router-dom";

import { RecipeVariants } from "@vanilla-extract/recipes";

import { ButtonStyle, LoaderMaskStyle, LoaderStyle } from "./button.css";

export const Button: React.FC<
	{
		title: String;
		action?: () => void;
		asyncAction?: () => void;
		circle?: boolean;
		to?: string;
	} & RecipeVariants<typeof ButtonStyle>
> = ({ title, to, type = "primary", action, asyncAction, circle }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = useCallback(async () => {
		if (asyncAction) {
			setIsLoading(true);
			await asyncAction();
			setIsLoading(false);
		} else if (action) {
			await action();
		} else {
			console.error("No action assigned to button");
		}
	}, [action]);

	const { Tag, props } = useMemo(() => {
		if (to) {
			const props: LinkProps = {
				to,
				onClick: undefined,
			};
			return {
				Tag: Link,
				props,
			};
		} else {
			const props: HTMLAttributes<HTMLDivElement> = {};
			return {
				Tag: "div",
				props,
			};
		}
	}, [to]);

	return (
		<Tag
			onClick={handleClick}
			className={ButtonStyle({
				type: type,
				shape: circle ? "circle" : "normal",
			})}
			{...props}
		>
			{isLoading && (
				<div className={LoaderMaskStyle}>
					<div className={LoaderStyle} />
				</div>
			)}
			<span style={isLoading ? { opacity: 0 } : undefined}>{title}</span>
		</Tag>
	);
};
