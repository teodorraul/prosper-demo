import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';

import { RootStore } from './root.store';

export const useStore = (): RootStore => {
	return useContext(MobXProviderContext)["value"] as RootStore;
};
