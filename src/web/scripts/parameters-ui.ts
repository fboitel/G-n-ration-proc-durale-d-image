import { BooleanParameter, ColorParameter, NumberParameter, Parameter, ParameterType } from '../../common/parameters';
import { Color, consColor, getRGB } from '../../common/color';

export function createParameterUI(parameter: Parameter<any>): ParameterUI<any, any, any> {
	switch (parameter.type) {
		case ParameterType.NUMBER:
			return new NumberParameterUI(parameter as NumberParameter);

		case ParameterType.COLOR:
			return new ColorParameterUI(parameter as ColorParameter);

		case ParameterType.BOOLEAN:
			return new BooleanParameterUI(parameter as BooleanParameter);

		default:
			throw new Error('Unexpected parameter type.');
	}
}

let paramIndex = 0;

export abstract class ParameterUI<T, D, P extends Parameter<T>> {
	public readonly parameter: P;
	public readonly container: HTMLElement;
	public readonly input: HTMLInputElement;

	public constructor(parameter: P) {
		this.parameter = parameter;

		this.input = document.createElement('input');
		this.input.type = this.getHtmlInputType();
		this.input.id = `param-${paramIndex++}`;
		this.setDomValue(this.toDomValue(parameter.default));

		const label = document.createElement('label');
		label.textContent = parameter.name + ' :';
		label.htmlFor = this.input.id;

		this.container = document.createElement('div');
		this.container.className = 'input-row';
		this.container.append(label, this.input);

		this.input.addEventListener('change', () => {
			this.setDomValue(this.toDomValue(this.getSanitizedValue()));
		});
	}

	public getSanitizedValue(): T {
		return this.sanitizeValue(this.parseValue(this.getDomValue()));
	}

	protected abstract getHtmlInputType(): string
	protected abstract getDomValue(): D;
	protected abstract setDomValue(value: D): void;
	protected abstract toDomValue(value: T): D
	protected abstract parseValue(value: D): T | null
	protected abstract sanitizeValue(value: T | null): T
}

abstract class ClassicParameterUI<T, P extends Parameter<T>> extends ParameterUI<T, string, P> {
	protected getDomValue(): string {
		return this.input.value;
	}

	protected setDomValue(value: string) {
		this.input.value = value;
	}
}

class NumberParameterUI extends ClassicParameterUI<number, NumberParameter> {
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

	protected toDomValue(value: number): string {
		return value.toString(10);
	}
}

class ColorParameterUI extends ClassicParameterUI<Color, ColorParameter> {
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

	protected toDomValue(value: Color): string {
		return '#' + getRGB(value).map(c => {
			let str = c.toString(16);
			if (str.length === 1) {
				str = '0' + str;
			}
			return str;
		}).join('');
	}
}

class BooleanParameterUI extends ParameterUI<boolean, boolean, BooleanParameter> {
	protected getHtmlInputType(): string {
		return 'checkbox';
	}

	protected getDomValue(): boolean {
		return this.input.checked;
	}

	protected setDomValue(value: boolean): void {
		this.input.checked = value;
	}

	protected parseValue(value: boolean): boolean | null {
		return value;
	}

	protected toDomValue(value: boolean): boolean {
		return value;
	}

	protected sanitizeValue(value: boolean | null): boolean {
		return value === null ? this.parameter.default : value;
	}
}
