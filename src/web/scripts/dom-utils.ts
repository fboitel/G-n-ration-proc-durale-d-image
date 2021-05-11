export function getElementById(id: string): HTMLElement {
	const element = document.getElementById(id);

	if (!element) {
		throw new Error('Failed to find DOM element.');
	}

	return element;
}

export function removeNode(node: Node) {
	const parent = node.parentNode;

	if (!parent) {
		throw new Error('Can\'t remove root node.');
	}

	parent.removeChild(node);
}
