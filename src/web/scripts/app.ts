import { FilterMeta, filters, GeneratorMeta, generators, Registry } from '../../common/registry';
import { BlockType, createBlock, evaluateGraph } from './graph';
import { clear } from './view';
import './background';
import { getElementById } from './dom-utils';

function createOptionGroup(name: string, registry: Registry<GeneratorMeta> | Registry<FilterMeta>): HTMLOptGroupElement {
	const group = document.createElement('optgroup');
	group.label = name;

	for (const key in registry) {
		const option = document.createElement('option');
		option.value = key;
		option.textContent = registry[key].name;
		group.appendChild(option);
	}

	return group;
}

const select = getElementById('generator-and-filters') as HTMLSelectElement;
select.appendChild(createOptionGroup('Générateurs', generators));
select.appendChild(createOptionGroup('Filtres', filters));

const button = getElementById('add-btn');
button.addEventListener('click', () => {
	const key = select.options[select.selectedIndex].value;
	const isGenerator = key in generators;
	const meta = isGenerator ? generators[key] : filters[key];

	createBlock(
		isGenerator ? BlockType.GENERATOR : BlockType.FILTER,
		isGenerator ? 0 : 1 + (meta as FilterMeta).additionalInputs,
		1,
		meta
	);
});


const exportBtn = getElementById('export') as HTMLButtonElement;
exportBtn.disabled = true;

exportBtn.addEventListener('click', () => {
	alert(JSON.stringify(evaluateGraph()));
});

// clear canvas
clear();
