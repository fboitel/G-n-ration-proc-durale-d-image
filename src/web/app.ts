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

	makeDraggable(element)
	graph.appendChild(element);
});

function makeDraggable(element: HTMLDivElement) {
	interface Position {
		x: number;
		y: number;
	}

	function getPos(e: MouseEvent): Position {
		return {
			x: e.clientX,
			y: e.clientY,
		};
	}

	element.addEventListener('mousedown', (e: MouseEvent) => {
		let pos = getPos(e);

		function drag(e: MouseEvent) {
			const newPos = getPos(e);

			const offset = {
				x: pos.x - newPos.x,
				y: pos.y - newPos.y,
			};

			element.style.top = (element.offsetTop - offset.y) + 'px';
			element.style.left = (element.offsetLeft - offset.x) + 'px';

			pos = newPos;
		}

		function stopDrag() {
			document.removeEventListener('mousemove', drag);
			document.removeEventListener('mouseup', stopDrag);
		}

		document.addEventListener('mouseup', stopDrag);
		document.addEventListener('mousemove', drag);
	});
}
