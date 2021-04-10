import { Filter } from '../../common/filters/filter';
import { Generator } from '../../common/generators/generator';
import { fractalNoise, perlinNoise } from '../../common/generators/noise';
import { NumberParam, Parameter } from './parameters';
import { blue, green, red } from '../../common/filters/colorimetry';

export interface GeneratorMeta {
	name: string;
	generator: Generator<any[]>;
	parameters: Parameter<any, any>[];
}

export interface FilterMeta {
	name: string;
	filter: Filter<any[]>;
	additionalInputs: number;
	parameters: Parameter<any, any>[];
}

export type Registry<T> = {[key: string]: T}

export const generators: Registry<GeneratorMeta> = {}
export const filters: Registry<FilterMeta> = {}

function registerGenerator(name: string, generator: Generator<any>, ...parameters: Parameter<any, any>[]) {
	generators[generator.name] = {name, generator, parameters};
}

function registerFilter(name: string, filter: Filter<any>, additionalInputs = 0, ...parameters: Parameter<any, any>[]) {
	filters[filter.name] = {name, filter, additionalInputs, parameters};
}

registerGenerator("Bruit de Perlin", perlinNoise, new NumberParam('Taille', 30));
registerGenerator("Bruit fractal", fractalNoise, new NumberParam('Couches', 3));

registerFilter("Rougir", red);
registerFilter("Bleuir", blue);
registerFilter("Verdir", green);
