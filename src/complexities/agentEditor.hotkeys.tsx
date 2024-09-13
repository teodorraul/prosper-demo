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

			if (process.env['IS_DEVELOPMENT']) {
				if ((event.ctrlKey || event.metaKey) && event.key === '1') {
					event.preventDefault();
					store.agentEditor.debugStacks();
					return;
				}
			}
		};

		document.addEventListener('keydown', callback);

		return () => {
			document.removeEventListener('keydown', callback);
		};
	}, [store]);
};
