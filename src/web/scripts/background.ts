import { getElementById } from './dom-utils'

const view = getElementById('view');

document.querySelectorAll('#bg-select .color-option').forEach((option, i) => {
	option.addEventListener('click', () => {
		view.className = `bg-${i}`;
	});
});
