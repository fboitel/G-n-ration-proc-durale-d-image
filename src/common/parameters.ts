import { Color } from './color';

export enum ParameterType {
	NUMBER,
	COLOR,
	BOOLEAN,
}

export interface Parameter<T> {
	type: ParameterType;
	name: string;
	default: T;
}

export interface NumberParameter extends Parameter<number> {
	type: ParameterType.NUMBER;
	min?: number;
	max?: number;
}

export interface ColorParameter extends Parameter<Color> {
	type: ParameterType.COLOR;
}

export interface BooleanParameter extends Parameter<boolean> {
	type: ParameterType.BOOLEAN;
}
