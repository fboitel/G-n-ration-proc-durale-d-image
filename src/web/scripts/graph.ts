import { FilterMeta, GeneratorMeta } from '../../common/registry'

export enum BlockType {
	GENERATOR,
	FILTER,
	OUTPUT,
}

export enum IOType {
	INPUT,
	OUTPUT,
}

export interface Block {
	type: BlockType;
	element: HTMLDivElement;
	meta?: GeneratorMeta | FilterMeta;
	inputs: IO[];
	outputs: IO[];
}

export interface IO {
	type: IOType;
	element: HTMLDivElement;
	parent: Block;
	edge?: Edge;
}

export interface Edge {
	from: Block;
	to: BlockType;
	element: SVGLineElement;
}

const graph = document.getElementById('graph');
let zIndex = 1;

function createIO(type: IOType, parent: Block): IO {
	const element = document.createElement('div');
	const ioType = ['in', 'out'][type];
	element.className = `io ${ioType}`;

	return {
		type,
		element,
		parent,
	};
}

function createIOBar(type: IOType, parent: Block, nbOfIO: number): HTMLDivElement {
	if (nbOfIO === 0) return null;

	const bar = document.createElement('div');
	const arrayType = ['inputs', 'outputs'][type] as 'inputs' | 'outputs';

	bar.className = 'io-bar';
	for (let i = 0; i < nbOfIO; ++i) {
		const io = createIO(type, parent);
		parent[arrayType].push(io);
		bar.appendChild(io.element);
	}

	return bar;
}

function createBlockBody(title: string): HTMLDivElement {
	const titleElement = document.createElement('h2');
	titleElement.textContent = title;

	const body = document.createElement('div');
	body.className = 'block-body';
	body.appendChild(titleElement);

	return body;
}

export function createBlock(type: BlockType, nbOfInputs: number, nbOfOutputs: number, meta?: GeneratorMeta | FilterMeta): Block {
	const parentBox = graph.getClientRects()[0];
	const element = document.createElement('div');
	const blockType = ['generator', 'filter', 'output'][type];
	element.className = `block ${blockType}`;
	element.style.left = parentBox.x + 'px';
	element.style.top = parentBox.y + 'px';
	element.style.zIndex = (zIndex++).toString();
	graph.appendChild(element);
	makeDraggable(element);

	const block: Block = {
		type,
		element,
		inputs: [],
		outputs: [],
	}
	if (meta) block.meta = meta;

	const inputs = createIOBar(IOType.INPUT, block, nbOfInputs);
	const outputs = createIOBar(IOType.OUTPUT, block, nbOfOutputs);

	if (inputs) element.appendChild(inputs);
	element.appendChild(createBlockBody(meta?.name ?? 'Afficher'));
	if (outputs) element.appendChild(outputs);

	return block;
}

function makeDraggable(element: HTMLElement) {
	element.addEventListener('mousedown', (e: MouseEvent) => {
		// move to the top
		element.style.zIndex = (zIndex++).toString();

		const mouseElementOffset = {
			x: element.offsetLeft - e.clientX,
			y: element.offsetTop - e.clientY,
		};

		function drag(e: MouseEvent) {
			const box = element.parentElement.getClientRects()[0];
			element.style.left = Math.min(box.x + box.width - element.clientWidth - 2, Math.max(box.x, e.clientX + mouseElementOffset.x)) + 'px';
			element.style.top = Math.min(box.y + box.height - element.clientHeight - 2, Math.max(box.y, e.clientY + mouseElementOffset.y)) + 'px';
		}

		function stopDrag() {
			document.removeEventListener('mousemove', drag);
			document.removeEventListener('mouseup', stopDrag);
		}

		document.addEventListener('mouseup', stopDrag);
		document.addEventListener('mousemove', drag);
	});
}
