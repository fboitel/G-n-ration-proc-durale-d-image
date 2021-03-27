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
button.addEventListener('click', () => {
	const key = select.options[select.selectedIndex].value;
	const isGenerator = key in generators;
	const meta = isGenerator ? generators[key] : filters[key];

	const element = document.createElement('div');
	element.className = `block ${isGenerator ? 'generator' : 'filter'}`;

	if (!isGenerator) {
		element.innerHTML = `
		<div class="io-bar">
			<div class="io"></div>
		</div>
	`;
	}

	element.innerHTML += `
		<div class="block-body">
			<h2>${meta.name}</h2>
		</div>
		<div class="io-bar">
			<div class="io"></div>
		</div>
	`;

	graph.appendChild(element);
	makeDraggable(element);
});

function makeDraggable(element: HTMLDivElement) {
	element.addEventListener('mousedown', (e: MouseEvent) => {
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
