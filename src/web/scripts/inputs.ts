import { evaluateGraph } from './graph';

export const getWidth  = checkInput('width', 500, 1);
export const getHeight = checkInput('height', 500, 1);
export const getSeed   = checkInput('seed', 42);

function checkInput(inputId: string, defaultValue: number, min: number = -Infinity): () => number {
	const input = document.getElementById(inputId) as HTMLInputElement;

	// overwrite bad values and recompute image with new value
	input.addEventListener('change', () => {
		input.value = getValue().toString();
		evaluateGraph();
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
