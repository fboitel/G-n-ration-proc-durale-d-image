import { FilterMeta, GeneratorMeta } from '../../common/registry';
import { srand } from '../../common/random';
import { getHeight, getSeed, getWidth } from './inputs';
import { createParameterUI, ParameterUI } from './parameters-ui'
import { clear, display } from './view'
import { readJSON } from '../../common/imageFactory'
import { getElementById, removeNode } from './dom-utils'

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
	parametersUI: ParameterUI<any, any>[]
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
	from: IO;
	to: IO;
	element: SVGLineElement;
}

const graph = getElementById('graph');
const lines = getElementById('lines');
const exportBtn = getElementById('export') as HTMLButtonElement;


const output = createBlock(BlockType.OUTPUT,1, 0);
let zIndex = 1;
let overedIO: IO | null = null;

function createIO(type: IOType, parent: Block): IO {
	const element = document.createElement('div');
	const ioType = ['in', 'out'][type];
	element.className = `io ${ioType}`;

	const io = {
		type,
		element,
		parent,
	};

	switch (type) {
		case IOType.INPUT:
			element.addEventListener('mouseenter', () => overedIO = io);
			element.addEventListener('mouseleave', () => overedIO = null);
			break;
		case IOType.OUTPUT:
			makeLinkable(io);
			break;
	}

	return io;
}

function createIOBar(type: IOType, parent: Block, nbOfIO: number): HTMLDivElement | null {
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

function createBlockBody(block: Block, title: string, parametersUI: ParameterUI<any, any>[]): HTMLDivElement {
	const titleElement = document.createElement('h2');
	titleElement.textContent = title;

	const body = document.createElement('div');
	body.className = 'block-body';
	body.appendChild(titleElement);

	if (block.type !== BlockType.OUTPUT) {
		const exitBtn = document.createElement('div');
		exitBtn.className = 'exit-btn';
		exitBtn.textContent = '×';
		exitBtn.addEventListener('click', () => {
			removeBlock(block);
			updateView();
		});
		body.appendChild(exitBtn);
	}

	for (const parameterUI of parametersUI) {
		body.appendChild(parameterUI.container);
		parameterUI.input.addEventListener('change', () => updateView());
	}

	return body;
}

export function createBlock(type: BlockType, nbOfInputs: number, nbOfOutputs: number, meta?: GeneratorMeta | FilterMeta): Block {
	const parentBox = graph.getClientRects()[0];
	const element = document.createElement('div');
	const blockType = ['generator', 'filter', 'output'][type];
	element.className = `block ${blockType} disconnected`;
	element.style.left = parentBox.x + 'px';
	element.style.top = parentBox.y + 'px';
	element.style.zIndex = (zIndex++).toString();
	graph.appendChild(element);

	const block: Block = {
		type,
		element,
		parametersUI: meta ? meta.parameters.map(createParameterUI) : [],
		inputs: [],
		outputs: [],
	}
	if (meta) block.meta = meta;

	makeDraggable(block);

	const inputs = createIOBar(IOType.INPUT, block, nbOfInputs);
	const outputs = createIOBar(IOType.OUTPUT, block, nbOfOutputs);

	if (inputs) element.appendChild(inputs);
	element.appendChild(createBlockBody(block, meta?.name ?? 'Afficher', block.parametersUI));
	if (outputs) element.appendChild(outputs);

	return block;
}

function makeDraggable(block: Block) {
	const { element } = block;

	element.addEventListener('mousedown', (e: MouseEvent) => {
		// move to the top
		element.style.zIndex = (zIndex++).toString();

		const mouseElementOffset = {
			x: element.offsetLeft - e.clientX,
			y: element.offsetTop - e.clientY,
		};

		function drag(e: MouseEvent) {
			const box = graph.getClientRects()[0];
			element.style.left = Math.min(box.x + box.width - element.clientWidth - 2, Math.max(box.x, e.clientX + mouseElementOffset.x)) + 'px';
			element.style.top = Math.min(box.y + box.height - element.clientHeight - 2, Math.max(box.y, e.clientY + mouseElementOffset.y)) + 'px';

			[...block.inputs, ...block.outputs].forEach(io => updateEdgeCoordinates(io));
		}

		function stopDrag() {
			document.removeEventListener('mousemove', drag);
			document.removeEventListener('mouseup', stopDrag);
		}

		document.addEventListener('mouseup', stopDrag);
		document.addEventListener('mousemove', drag);
	});
}

function makeLinkable(io: IO) {
	io.element.addEventListener('mousedown', e => {
		e.stopPropagation();

		graph.classList.add('link-building');

		removeEdge(io.edge ?? null);

		const linesBox = lines.getClientRects()[0];
		const line = createLine(io, e.clientX - linesBox.x, e.clientY - linesBox.y);

		document.addEventListener('mousemove', dragLink);
		document.addEventListener('mouseup', dropLink);

		function dragLink(e: MouseEvent) {
			setCoordinate(line, 'x2', e.clientX - linesBox.x);
			setCoordinate(line, 'y2', e.clientY - linesBox.y);
		}

		function dropLink() {
			document.removeEventListener('mousemove', dragLink);
			document.removeEventListener('mouseup', dropLink);

			graph.classList.remove('link-building');

			if (overedIO === null) {
				lines.removeChild(line);

			} else {
				removeEdge(overedIO.edge ?? null);

				io.edge = overedIO.edge = {
					from: io,
					to: overedIO,
					element: line,
				};

				updateEdgeCoordinates(overedIO);

				updateConnectionFlag(io.parent);
				updateConnectionFlag(overedIO.parent);
			}

			updateView();
		}
	});
}

function removeEdge(edge: Edge | null) {
	if (!edge) return;

	edge.from.parent.element.classList.add('disconnected');
	edge.to.parent.element.classList.add('disconnected');

	lines.removeChild(edge.element);
	delete edge.from.edge;
	delete edge.to.edge;
}

function removeBlock(block: Block) {
	[...block.inputs, ...block.outputs].forEach(e => removeEdge(e.edge ?? null));
	removeNode(block.element);
}

function updateConnectionFlag(block: Block) {
	const disconnected = [...block.inputs, ...block.outputs].find(io => io.edge === undefined);
	block.element.classList[disconnected ? 'add' : 'remove']('disconnected');
}

function createLine(from: IO, toX: number, toY: number): SVGLineElement {
	const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.style.stroke = 'var(--font-color)';
	line.style.strokeWidth = '2px';

	updateEdgeCoordinates(from, line);
	setCoordinate(line, 'x2', toX);
	setCoordinate(line, 'y2', toY);

	lines.appendChild(line);
	return line;
}

function setCoordinate(line: SVGLineElement, coordinate: 'x1' | 'y1' | 'x2' | 'y2', value: number) {
	line[coordinate].baseVal.newValueSpecifiedUnits(line[coordinate].baseVal.SVG_LENGTHTYPE_PX, value);
}

function updateEdgeCoordinates(io: IO, edgeElement?: SVGLineElement) {
	if (!edgeElement) edgeElement = io.edge?.element;
	if (!edgeElement) return;

	const input = io.type === IOType.OUTPUT;
	const ioBox = io.element.getClientRects()[0];
	const linesBox = lines.getClientRects()[0];

	setCoordinate(edgeElement, input ? 'x1' : 'x2', ioBox.x + ioBox.width / 2 - linesBox.x);
	setCoordinate(edgeElement, input ? 'y1' : 'y2', ioBox.y + ioBox.height / 2 - linesBox.y);
}

export function updateView() {
	srand(getSeed());
	const json = evaluateGraph();
	exportBtn.disabled = !json;

	if (json) {
		const image = readJSON(json);
		if (!image) {
			throw new Error('Failed to construct image');
		}
		display(image);
	} else {
		clear();
	}
}

export function evaluateGraph(): any {
	const width = getWidth();
	const height = getHeight();
	return evaluateBlock(output);

	function evaluateBlock(block: Block): any {
		let json: any;

		switch(block.type) {
			case BlockType.GENERATOR:
				json = {
					type: 'generator',
					name: (block.meta as GeneratorMeta).generator.name,
					params: {
						width,
						height,
					},
				};
				break;

			case BlockType.FILTER:
				json = {
					type: 'filter',
					name: (block.meta as FilterMeta).filter.name,
				};
				break;

			case BlockType.OUTPUT:
				const parent = output.inputs[0].edge?.from?.parent;
				return parent ? evaluateBlock(parent) : null;
		}

		if (block.meta && block.meta.parameters.length > 0) {
			if (!json.params) json.params = {};
			for (let i = 0; i < block.meta.parameters.length; ++i) {
				json.params[block.meta.parameters[i].name] = block.parametersUI[i].getSanitizedValue();
			}
		}

		if (block.type === BlockType.FILTER) {
			json.inputs = [];
			for (const input of block.inputs) {
				if (!input.edge) return null;
				const jsonInput = evaluateBlock(input.edge.from.parent)
				if (!jsonInput) return null;
				json.inputs.push(jsonInput);
			}
		}

		return json;
	}
}
