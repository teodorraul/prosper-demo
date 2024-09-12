import { ReactElement } from 'react';
import { FetchStatus } from 'src/store/utils';

import { RecipeVariants } from '@vanilla-extract/recipes';

import { LoaderContainerStyle, LoaderStyle } from './loadingContainer.css';

export const LoadingContainer: React.FC<
	{
		status: FetchStatus;
		children: ReactElement;
		keepLoading: boolean;
	} & RecipeVariants<typeof LoaderStyle>
> = ({ status, children, size = "small", keepLoading }) => {
	if (status == "started" || status == "initial" || keepLoading === true)
		return (
			<div className={LoaderContainerStyle}>
				<div className={LoaderStyle({ size })}></div>
			</div>
		);
	if (status == "error") return <div>Encountered an error</div>;

	return <div>{children}</div>;
};
