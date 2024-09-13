// https://heroicons.com/solid
export const Icon: React.FC<{
	type: 'phone' | 'selector' | 'xmark' | 'shutdown';
	className?: string;
}> = ({ type, className }) => {
	if (type == 'phone')
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className={className}
			>
				<path
					fillRule="evenodd"
					d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
					clipRule="evenodd"
				/>
			</svg>
		);

	if (type == 'xmark')
		return (
			<svg
				width="12"
				height="11"
				viewBox="0 0 12 11"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
			>
				<line
					x1="1.37959"
					y1="1.29289"
					x2="10.3796"
					y2="10.2929"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<line
					y1="-1"
					x2="12.7279"
					y2="-1"
					transform="matrix(-0.707107 0.707107 0.707107 0.707107 11 2)"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</svg>
		);

	if (type == 'selector')
		return (
			<svg
				width="12"
				height="24"
				viewBox="0 0 12 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
			>
				<path d="M6 4L2 9H10L6 4Z" fill="black" />
				<path d="M6 20L10 15H2L6 20Z" fill="black" />
			</svg>
		);

	if (type == 'shutdown')
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className={className}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
				/>
			</svg>
		);

	return <></>;
};
