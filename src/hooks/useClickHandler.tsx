import { useCallback } from 'react';

export function useClickHandler(
	attr: string,
	cb: (attr: string, e: React.MouseEvent) => void,
	deps: Array<any>
) {
	const c = useCallback(
		async (e: any) => {
			let elem = e.target || e.currentTarget;

			let elemAttribute = elem?.getAttribute('data-' + attr);
			let closestAttribute = elem
				?.closest(`[data-${attr}]`)
				?.getAttribute('data-' + attr);

			await cb(elemAttribute || closestAttribute, e);
		},
		[cb, ...deps]
	);
	return c;
}
