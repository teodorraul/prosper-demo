import { observable } from 'mobx';
import { v4 as uuid } from 'uuid';

export class StartNode {
    id = uuid()
}

export class EndNode {
    id = uuid()
}

export class Node {
    id = uuid()
	@observable accessor prompt: string = "";
}