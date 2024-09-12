import { useEffect } from 'react';
import { useStore } from 'src/store/useStore';

export const useAgentEditorHotkeys = () => {
	const store = useStore();

	useEffect(() => {
		const callback = (event: any) => {
			if (
				(event.ctrlKey || event.metaKey) &&
				event.shiftKey &&
				event.key === "z"
			) {
				event.preventDefault();
				store.agentEditor.redo();
				return;
			}

			if ((event.ctrlKey || event.metaKey) && event.key === "z") {
				event.preventDefault();
				store.agentEditor.undo();
				return;
			}
		};

		document.addEventListener("keydown", callback);

		return () => {
			document.removeEventListener("keydown", callback);
		};
	}, [store]);
};
