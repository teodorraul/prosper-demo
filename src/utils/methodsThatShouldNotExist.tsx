import { RemoteAgentEditorNodeUserData } from 'src/store/agents.types';

export const MTSNEReturnDataExtractionId = (
	de: RemoteAgentEditorNodeUserData
) => {
	if (de.id) return de.id;
	return de.data_type + de.description + de.name;
};
