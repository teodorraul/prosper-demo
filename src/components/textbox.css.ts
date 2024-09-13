

import { Inter } from 'src/brand/typography.css';

import { keyframes, style } from '@vanilla-extract/css';

export const TextboxStyle = style({
    margin: 0,
    padding: 0,
    border: 'none',
    width: '100%',
    fontFamily: Inter,
    paddingBottom: 10,
    lineHeight: '1.5em',
});

const Breath = keyframes({
    '0%': { opacity: 1 },
	'20%': { opacity: 1 },
    '43%': { opacity: 0.33 },
    '50%': { opacity: 0.33 },
    '60%': { opacity: 0.33 },
	'80%': { opacity: 1 },
    '100%': { opacity: 1 },
});

export const TextboxContainerStyle = style({
    marginTop: 10,
    position: 'relative',

    // ':before': {
    //     content: "",
    //     display: 'block',
    //     position: 'absolute',
    //     bottom: -4,
    //     height: 2,
    //     width: '100%',
    //     borderRadius: 99,
    //     left: 0,
    //     background: Colors.accent.r,
	// 	animationName: Breath,
	// 	animationDuration: "4s",
	// 	animationIterationCount: "infinite",
    // }
})
