import { updateView } from './graph';
import { getElementById } from './dom-utils';

export const getWidth  = checkInput('width', 500, 1);
export const getHeight = checkInput('height', 500, 1);
export const getSeed   = checkInput('seed', 42);

function checkInput(inputId: string, defaultValue: number, min = -Infinity): () => number {
	const input = getElementById(inputId) as HTMLInputElement;

	// overwrite bad values and recompute image with new value
	input.addEventListener('change', () => {
		input.value = getValue().toString();
		updateView();
	});

	function getValue(): number {
		let value = parseInt(input.value, 10);

		if (isNaN(value)) {
			value = defaultValue;
		}

		return Math.max(min, value);
	}

	return getValue;
}
