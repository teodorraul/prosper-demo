import { fontFace } from '@vanilla-extract/css';

export const Playfair = fontFace([
	{
		src: `url('/zzz/prosp/fonts/Playfair.woff2') format('woff2')`,
		fontWeight: 'bold',
		fontStyle: 'normal',
		fontDisplay: 'swap',
	},
]);

export const Inter = fontFace([
	{
		src: `url('/zzz/prosp/fonts/Inter-Medium.woff2') format('woff2')`,
		fontWeight: 'regular',
		fontStyle: 'normal',
		fontDisplay: 'swap',
	},
	{
		src: `url('/zzz/prosp/fonts/Inter-Bold.woff2') format('woff2')`,
		fontWeight: 'bold',
		fontStyle: 'normal',
		fontDisplay: 'swap',
	},
]);
