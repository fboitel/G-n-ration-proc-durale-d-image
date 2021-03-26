import { filters, generators } from '../common/registry'

function createOptionGroup(name: string, options: string[]): HTMLOptGroupElement {
	const group = document.createElement('optgroup');
	group.label = name;

	for (const optionName of options) {
		const option = document.createElement('option');
		option.value = optionName;
		option.textContent = optionName;
		group.appendChild(option);
	}

	return group;
}

const select = document.getElementById('generator-and-filters') as HTMLSelectElement;
select.appendChild(createOptionGroup('Générateurs', Object.values(generators).map(g => g.name)));
select.appendChild(createOptionGroup('Filtres', Object.values(filters).map(g => g.name)));

const graph = document.getElementById('graph') as HTMLDivElement;

const button = document.getElementById('add-btn');
button.addEventListener('click', () => {
	const name = select.options[select.selectedIndex].value;
	const element = document.createElement('div');
	element.className = 'block';
	element.textContent = name;
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
