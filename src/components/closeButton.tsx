import { CloseButtonIconStyle, CloseButtonStyle } from './closeButton.css';
import { Icon } from './icon';

export const CloseButton: React.FC<{ onClick: (ev: any) => {} }> = ({
	onClick,
	...props
}) => {
	return (
		<div className={CloseButtonStyle()} onClick={onClick} {...props}>
			<Icon type="xmark" className={CloseButtonIconStyle} />
		</div>
	);
};
