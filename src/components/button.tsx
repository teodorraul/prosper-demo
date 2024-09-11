import { useCallback, useState } from 'react';

import { ButtonStyle, LoaderMaskStyle, LoaderStyle } from './button.css';

export const Button: React.FC<{
	title: String;
	action?: () => void;
	asyncAction?: () => void;
}> = ({ title, action, asyncAction }) => {
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

	return (
		<button
			onClick={handleClick}
			className={ButtonStyle({ type: "primary" })}
		>
			{isLoading && (
				<div className={LoaderMaskStyle}>
					<div className={LoaderStyle} />
				</div>
			)}
			<span style={isLoading ? { opacity: 0 } : undefined}>{title}</span>
		</button>
	);
};
