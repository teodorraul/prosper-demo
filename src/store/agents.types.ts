import { observable } from 'mobx';

import { fakeID } from './utils';

export class Agent {
	id = fakeID();
	@observable accessor prompt: string = "";
}
