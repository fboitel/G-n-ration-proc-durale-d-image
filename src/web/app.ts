import { FilterMeta, filters, GeneratorMeta, generators, Registry } from '../common/registry'

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

const graph = document.getElementById('graph') as HTMLDivElement;
const button = document.getElementById('add-btn');

let zIndex = 1;

button.addEventListener('click', () => {
	const key = select.options[select.selectedIndex].value;
	const isGenerator = key in generators;
	const meta = isGenerator ? generators[key] : filters[key];
	const box = graph.getClientRects()[0]

	const element = document.createElement('div');
	element.className = `block ${isGenerator ? 'generator' : 'filter'}`;
	element.style.zIndex = (zIndex++).toString();
	element.style.left = box.x + 'px';
	element.style.top = box.y + 'px';

	if (!isGenerator) {
		element.innerHTML = `
		<div class="io-bar">
			<div class="io in"></div>
		</div>
	`;
	}

	element.innerHTML += `
		<div class="block-body">
			<h2>${meta.name}</h2>
		</div>
		<div class="io-bar">
			<div class="io out"></div>
		</div>
	`;

	graph.appendChild(element);
	makeDraggable(element);
});

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

// @ts-ignore
const line = document.getElementById('line') as SVGLineElement;

document.addEventListener('mousemove', e => {
	const box = graph.getClientRects()[0];
	line.x2.baseVal.newValueSpecifiedUnits(line.x2.baseVal.SVG_LENGTHTYPE_NUMBER, e.clientX - box.x);
	line.y2.baseVal.newValueSpecifiedUnits(line.y2.baseVal.SVG_LENGTHTYPE_NUMBER, e.clientY - box.y);
});
