import { Colors } from 'src/brand/colors';
import { Inter, Playfair } from 'src/brand/typography.css';

import { recipe } from '@vanilla-extract/recipes';

export const TextStyle = recipe({
	base: {
		margin: 0,
		padding: 0,
	},
	variants: {
		level: {
			title: {
				fontSize: 44,
				fontFamily: Playfair,
			},
			microtitle: {
				fontSize: 11,
				lineHeight: '1em',
				marginBottom: '3px',
				textTransform: 'uppercase',
			},
			body: {
				fontSize: 13,
				margin: 0,
				lineHeight: '1.5em',
			},
		},
		color: {
			text: {},
			subtle: { color: Colors.text.t2 },
		},
		oneLine: {
			true: {
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
		},
		pre: {
			true: {
				whiteSpace: 'pre-wrap'
			}
		},
		ctx: {
			default: {},
			node: {},
		},
	},
	compoundVariants: [
		{
			variants: {
				ctx: 'node',
				level: 'title',
			},
			style: {
				color: Colors.text.r,
				fontFamily: Inter,
				fontWeight: 'bold',
				fontSize: 15
			},
		},
		{
			variants: {
				ctx: 'node',
				level: 'body',
			},
			style: {
				fontSize: 13,
				lineHeight: '1.5em',
				color: Colors.text.t2,
			},
		},
	],
});
