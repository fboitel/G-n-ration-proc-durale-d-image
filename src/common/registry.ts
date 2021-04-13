import { Filter } from './filters/filter';
import { Generator } from './generators/generator';
import { fractalNoise, perlinNoise } from './generators/noise';
import { Parameter, ParameterType } from './parameters';
import { blue, green, red } from './filters/colorimetry';

export interface GeneratorMeta {
	name: string;
	generator: Generator<any[]>;
	parameters: Parameter<any>[];
}

export interface FilterMeta {
	name: string;
	filter: Filter<any[]>;
	additionalInputs: number;
	parameters: Parameter<any>[];
}

export type Registry<T> = {[key: string]: T}

export const generators: Registry<GeneratorMeta> = {}
export const filters: Registry<FilterMeta> = {}

function registerGenerator(name: string, generator: Generator<any>, ...parameters: Parameter<any>[]) {
	generators[generator.name] = {name, generator, parameters};
}

function registerFilter(name: string, filter: Filter<any>, additionalInputs = 0, ...parameters: Parameter<any>[]) {
	filters[filter.name] = {name, filter, additionalInputs, parameters};
}

registerGenerator("Bruit de Perlin", perlinNoise, {type: ParameterType.NUMBER, name: 'Taille', default: 30});
registerGenerator("Bruit fractal", fractalNoise, {type: ParameterType.NUMBER, name: 'Couches', default: 3});

registerFilter("Rougir", red);
registerFilter("Bleuir", blue);
registerFilter("Verdir", green);
