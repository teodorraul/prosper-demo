import { Colors } from 'src/brand/colors';

import { CSSProperties, style } from '@vanilla-extract/css';

export const AENButtonsHolder = style({
	position: 'absolute',
	bottom: 0,
	transform: 'translateY(100%)',
	left: 0,
	height: 100,
	width: '100%',
	zIndex: -1,
	//debug
	// background: 'red'
});

const CommonBeforeStyles: CSSProperties = {
	position: 'absolute',
	top: 0,
	content: '',
	display: 'block',
	width: 30,
	height: 33,
	borderBottom: `1px solid ${Colors.editor.edge}`,
};

export const AENButtonLeftSide = style({
	position: 'absolute',
	height: '100%',
	left: '0%',
	width: '50%',
	':before': {
		...CommonBeforeStyles,
		right: 45,
		borderRight: `1px solid ${Colors.editor.edge}`,
		borderBottomRightRadius: '14px',
	},
});

export const AENButtonRightSide = style({
	position: 'absolute',
	height: '100%',
	left: '50%',
	width: '50%',
	':before': {
		...CommonBeforeStyles,
		left: 45,
		borderLeft: `1px solid ${Colors.editor.edge}`,
		borderBottomLeftRadius: '14px',
	},
});

export const AENButton = style({
	position: 'absolute',
	selectors: {
		[`${AENButtonRightSide} &`]: {
			left: 75,
			top: 17,
		},
		[`${AENButtonLeftSide} &`]: {
			right: 75,
			top: 17,
		},
	},
});
