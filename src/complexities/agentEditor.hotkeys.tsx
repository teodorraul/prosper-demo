import { useEffect, useRef } from 'react';
import { useStore } from 'src/store/useStore';

export const useAgentEditorHotkeys = () => {
	const store = useStore();
	const selectedNode = store.agentEditor.selectedNode;
	const selectedNodeRef = useRef<string | undefined>(undefined);

	useEffect(() => {
		selectedNodeRef.current = selectedNode;
	}, [selectedNode]);

	useEffect(() => {
		const callback = (event: any) => {
			let sel = selectedNodeRef.current;
			const activeElement: any = document.activeElement;

			if (process.env['IS_DEVELOPMENT']) {
				if ((event.ctrlKey || event.metaKey) && event.key === '1') {
					event.preventDefault();
					store.agentEditor.debugStacks();
					return;
				}
			}

			if (activeElement) {
				let isInput = false;

				if (
					activeElement.nodeName === 'INPUT' &&
					activeElement.type === 'text'
				) {
					isInput = true;
				} else if (activeElement.nodeName === 'TEXTAREA') {
					isInput = true;
				}

				if (isInput) {
					if (event.key === 'Escape') {
						activeElement.blur();
						return;
					}
					return;
				}
			}

			if (sel) {
				if (event.key === 'Escape') {
					store.agentEditor.selectNode(undefined);
				}
			}

			if (
				(event.ctrlKey || event.metaKey) &&
				event.shiftKey &&
				event.key === 'z'
			) {
				event.preventDefault();
				store.agentEditor.redo();
				return;
			}

			if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
				event.preventDefault();
				store.agentEditor.undo();
				return;
			}

			if (event.key === 'Delete' || event.key === 'Backspace') {
				event.preventDefault();
				if (sel) {
					store.agentEditor.removeNode(sel);
				}
			}
		};

		document.addEventListener('keydown', callback);

		return () => {
			document.removeEventListener('keydown', callback);
		};
	}, [store]);
};
