import { HTMLAttributes, useCallback, useMemo, useState } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { RecipeVariants } from '@vanilla-extract/recipes';

import { ButtonStyle, LoaderMaskStyle, LoaderStyle } from './button.css';

export const Button: React.FC<
	{
		title: String;
		action?: (event: any) => void;
		asyncAction?: (event: any) => void;
		circle?: boolean;
		to?: string;
		center?: boolean;
		className?: string;
	} & RecipeVariants<typeof ButtonStyle>
> = ({
	title,
	to,
	type = 'primary',
	center,
	action,
	asyncAction,
	circle,
	onClick,
	className,
	...otherProps
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = useCallback(
		async (e) => {
			if (asyncAction) {
				setIsLoading(true);
				await asyncAction(e);
				setIsLoading(false);
			} else if (action) {
				await action(e);
			} else {
				console.error('No action assigned to button');
			}
		},
		[action]
	);

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
				Tag: 'div',
				props,
			};
		}
	}, [to]);

	return (
		<Tag
			onClick={handleClick}
			{...otherProps}
			className={`${ButtonStyle({
				type: type,
				align: center ? 'center' : 'normal',
				shape: circle ? 'circle' : 'normal',
			})} ${className}`}
			{...props}
		>
			{isLoading && (
				<div className={LoaderMaskStyle({ type })}>
					<div className={LoaderStyle} />
				</div>
			)}
			<span style={isLoading ? { opacity: 0 } : undefined}>{title}</span>
		</Tag>
	);
};
