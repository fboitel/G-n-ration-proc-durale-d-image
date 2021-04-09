let paramIndex = 0;

export abstract class Parameter<I extends HTMLElement, V> {
	public readonly ui: HTMLElement;
	public readonly input: I;

	protected constructor(ui: HTMLElement, input: I) {
		this.ui = ui;
		this.input = input;
	}

	public abstract getValue(): V;
}

export class NumberParam extends Parameter<HTMLInputElement, number> {
	private readonly defaultValue: number;
	private readonly min: number;
	private readonly max: number;

	public constructor(name: string, defaultValue: number, min = -Infinity, max = +Infinity) {
		if (min > defaultValue || defaultValue > max) {
			throw new Error('incorrect bounds');
		}

		const input = document.createElement('input');
		input.type = "number";
		input.value = defaultValue.toString();
		input.id = `param-${paramIndex++}`;

		const label = document.createElement('label');
		label.textContent = name;
		label.htmlFor = input.id;

		const ui = document.createElement('div');
		ui.append(label, input);

		input.addEventListener('change', () => {
			input.value = this.getValue().toString();
		});

		super(ui, input);
		this.defaultValue = defaultValue;
		this.min = min;
		this.max = max;
	}

	public getValue(): number {
		let value = parseInt(this.input.value);

		if (isNaN(value)) {
			value = this.defaultValue;
		} else if (value < this.min) {
			value = this.min;
		} else if (value > this.max) {
			value = this.max;
		}

		return value;
	}
}
