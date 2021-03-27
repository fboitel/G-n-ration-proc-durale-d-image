import { FilterMeta, filters, GeneratorMeta, generators, Registry } from '../../common/registry'
import { BlockType, createBlock } from './graph'

function createOptionGroup(name: string, registry: Registry<GeneratorMeta> | Registry<FilterMeta>): HTMLOptGroupElement {
	const group = document.createElement('optgroup');
	group.label = name;

	for (const key in registry) {
		if (!registry.hasOwnProperty(key)) continue;
		const option = document.createElement('option');
		option.value = key;
		option.textContent = registry[key].name;
		group.appendChild(option);
	}

	return group;
}

const select = document.getElementById('generator-and-filters') as HTMLSelectElement;
select.appendChild(createOptionGroup('Générateurs', generators));
select.appendChild(createOptionGroup('Filtres', filters));

createBlock(BlockType.OUTPUT,1, 0);

const graph = document.getElementById('graph') as HTMLDivElement;
const button = document.getElementById('add-btn');

button.addEventListener('click', () => {
	const key = select.options[select.selectedIndex].value;
	const isGenerator = key in generators;
	const meta = isGenerator ? generators[key] : filters[key];

	const block = createBlock(isGenerator ? BlockType.GENERATOR : BlockType.FILTER, isGenerator ? 0 : 1, 1, meta);
	console.log(block);
});


// @ts-ignore
const line = document.getElementById('line') as SVGLineElement;

document.addEventListener('mousemove', e => {
	const box = graph.getClientRects()[0];
	line.x2.baseVal.newValueSpecifiedUnits(line.x2.baseVal.SVG_LENGTHTYPE_NUMBER, e.clientX - box.x);
	line.y2.baseVal.newValueSpecifiedUnits(line.y2.baseVal.SVG_LENGTHTYPE_NUMBER, e.clientY - box.y);
});
