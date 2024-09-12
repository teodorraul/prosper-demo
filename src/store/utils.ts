export class Collection<T extends { id: string }> {
	at: { [key: string]: T };
	all: string[];

	constructor() {
		this.at = {};
		this.all = [];
	}

	insert(item: T): void {
		this.at[item.id] = item;
		this.all.push(item.id);
	}

	remove(itemId: string): void {
		delete this.at[itemId];
		this.all = this.all.filter((id) => id !== itemId);
	}

	update(itemId: string, updatedItem: T): void {
		if (this.at[itemId]) {
			this.at[itemId] = updatedItem;
		}
	}

	initFromObject(object: any) {
		this.at = object.at;
		this.all = object.all;
	}
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const fakeID = () => Math.floor(Math.random() * 100000);

export type FetchStatus = "initial" | "started" | "done" | "error";

export type XYPosition = {
	x: number;
	y: number;
};
