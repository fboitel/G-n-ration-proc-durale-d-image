import { ColorParameter, NumberParameter, Parameter, ParameterType } from './parameters'
import { Color } from '../../common/color'

export function createParameterUI(parameter: Parameter<any>): ParameterUI<any, any> {
	switch (parameter.type) {
		case ParameterType.NUMBER:
			return new NumberParameterUI(parameter as NumberParameter);

		case ParameterType.COLOR:
			return new ColorParameterUI(parameter as ColorParameter);
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
	protected abstract parseValue(value: string): T
	protected abstract sanitizeValue(value: T): T
}

class NumberParameterUI extends ParameterUI<number, NumberParameter> {
	protected getHtmlInputType(): string {
		return 'number';
	}

	protected parseValue(value: string): number {
		return parseInt(value, 10);
	}

	protected sanitizeValue(value: number): number {
		if (isNaN(value)) {
			return this.parameter.default;
		}

		if (value < this.parameter.min) {
			return this.parameter.min;
		}

		if (value > this.parameter.max) {
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

	protected parseValue(value: string): Color {
		// TODO
		return null;
	}

	protected sanitizeValue(value: Color): Color {
		// TODO
		return null;
	}

	protected valueToString(value: Color): string {
		// TODO
		return null;
	}
}
