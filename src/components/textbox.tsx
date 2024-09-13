import { useCallback, useEffect, useRef, useState } from 'react';

import { TextboxContainerStyle, TextboxStyle } from './textbox.css';

export const Textbox: React.FC<{
	placeholder: string;
	autofocus?: boolean;
	autofocusIfEmpty?: boolean;
	remoteValue: string | undefined;
	className: string;
	onChange: (value: string, ev: any) => void;
	onDelayedChange: (value: string) => void;
}> = ({
	remoteValue,
	placeholder,
	autofocusIfEmpty,
	onChange,
	autofocus,
	onDelayedChange,
	className,
}) => {
	const ref = useRef<HTMLTextAreaElement>(null);
	const [value, setValue] = useState<string | undefined>(undefined);
	const [_, setIsFocused] = useState(false);
	const _value = useRef<string | undefined>(undefined);
	const _isFocused = useRef<boolean>(false);
	const _mounted = useRef(false);
	const _throttleTimer = useRef<any>(undefined);

	const handleChange = useCallback(
		(e: any) => {
			setValue(e.target.value);
			onChange?.(e.target.value, e);
			_value.current = e.target.value;

			if (_throttleTimer.current) {
				clearTimeout(_throttleTimer.current);
			}

			_throttleTimer.current = setTimeout(() => {
				if (_value.current !== undefined) {
					onDelayedChange?.(_value.current);
				}
			}, 800);
		},
		[onChange, onDelayedChange]
	);

	const handleBlur = useCallback(() => {
		if (ref.current) {
			clearTimeout(_throttleTimer.current);
		}

		if (_value.current !== undefined) {
			onDelayedChange?.(_value.current);
		}

		setIsFocused(false);
		_isFocused.current = false;
	}, [onDelayedChange]);

	const handleFocus = useCallback(() => {
		setIsFocused(true);
		_isFocused.current = true;
	}, []);

	useEffect(() => {
		if (_isFocused.current) {
			if (_value.current === undefined) setValue(remoteValue ?? '');
			return;
		} else {
			if (remoteValue) setValue(remoteValue ?? '');
		}
	}, [remoteValue]);

	useEffect(() => {
		if (_mounted.current == false) {
			if (value !== undefined) {
				if (value == '') {
					if (autofocusIfEmpty) {
						ref.current?.focus();
					}
				} else {
					if (autofocus) {
						ref.current?.focus();
					}
				}
				_mounted.current = true;
			}
		}
	}, [value, autofocus, autofocusIfEmpty]);

	return (
		<div className={TextboxContainerStyle}>
			<textarea
				value={value}
				ref={ref}
				placeholder={placeholder}
				className={`${TextboxStyle} ${className}`}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
			></textarea>
		</div>
	);
};
