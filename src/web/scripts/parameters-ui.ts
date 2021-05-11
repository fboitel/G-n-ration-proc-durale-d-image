import { ColorParameter, NumberParameter, Parameter, ParameterType } from '../../common/parameters';
import { Color, consColor, getRGB } from '../../common/color';

export function createParameterUI(parameter: Parameter<any>): ParameterUI<any, any> {
	switch (parameter.type) {
		case ParameterType.NUMBER:
			return new NumberParameterUI(parameter as NumberParameter);

		case ParameterType.COLOR:
			return new ColorParameterUI(parameter as ColorParameter);

		case ParameterType.BOOLEAN:
			// TODO

		default:
			throw new Error('Unexpected parameter type.');
	}
}

let paramIndex = 0;

export abstract class ParameterUI<T, P extends Parameter<T>> {
	public readonly parameter: P;
	public readonly container: HTMLElement;
	public readonly input: HTMLInputElement;

	public constructor(parameter: P) {
		this.parameter = parameter;

		this.input = document.createElement('input');
		this.input.type = this.getHtmlInputType();
		this.input.value = this.valueToString(parameter.default);
		this.input.id = `param-${paramIndex++}`;

		const label = document.createElement('label');
		label.textContent = parameter.name + ' :';
		label.htmlFor = this.input.id;

		this.container = document.createElement('div');
		this.container.className = 'input-row';
		this.container.append(label, this.input);

		this.input.addEventListener('change', () => {
			this.input.value = this.valueToString(this.getSanitizedValue());
		});
	}

	public getSanitizedValue(): T {
		return this.sanitizeValue(this.parseValue(this.input.value));
	}

	protected abstract getHtmlInputType(): string
	protected abstract valueToString(value: T): string
	protected abstract parseValue(value: string): T | null
	protected abstract sanitizeValue(value: T | null): T
}

class NumberParameterUI extends ParameterUI<number, NumberParameter> {
	protected getHtmlInputType(): string {
		return 'number';
	}

	protected parseValue(value: string): number {
		return parseInt(value, 10);
	}

	protected sanitizeValue(value: number | null): number {
		if (value === null || isNaN(value)) {
			return this.parameter.default;
		}

		if (this.parameter.min !== undefined && value < this.parameter.min) {
			return this.parameter.min;
		}

		if (this.parameter.max !== undefined && value > this.parameter.max) {
			return this.parameter.max;
		}

		return value;
	}

	protected valueToString(value: number): string {
		return value.toString(10);
	}
}

class ColorParameterUI extends ParameterUI<Color, ColorParameter> {
	protected getHtmlInputType(): string {
		return 'color';
	}

	protected parseValue(value: string): Color | null {
		if (value.length !== 7) {
			return null;
		}

		value = value.substring(1);

		const r = parseInt(value.substring(0, 2), 16);
		const g = parseInt(value.substring(2, 4), 16);
		const b = parseInt(value.substring(4, 6), 16);

		if (isNaN(r) || isNaN(g) || isNaN(b)) {
			return null;
		}

		return consColor(r, g, b);
	}

	protected sanitizeValue(value: Color | null): Color {
		return value ?? this.parameter.default;
	}

	protected valueToString(value: Color): string {
		return '#' + getRGB(value).map(c => {
			let str = c.toString(16);
			if (str.length === 1) {
				str = '0' + str;
			}
			return str;
		}).join('');
	}
}
