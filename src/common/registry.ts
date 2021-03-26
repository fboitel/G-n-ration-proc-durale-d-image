import { blue, Filter, green, red } from './filter'
import { Generator} from './generators/generator'
import { fractalNoise, perlinNoise } from './generators/noise'
import { Image } from './image'

interface GeneratorMeta {
	name: string;
	generator: Generator<any[]>;
}

interface FilterMeta {
	name: string;
	filter: Filter<any[]>;
}

export const generators: {[key: string]: GeneratorMeta} = {}
export const filters: {[key: string]: FilterMeta} = {}

function registerGenerator(name: string, generator: Generator<any>) {
	generators[generator.name] = {name, generator};
}

function registerFilter(name: string, filter: Filter<any>) {
	filters[filter.name] = {name, filter};
}

///// temporary
function perlinNoiseImpl(): Image {
	return perlinNoise(500, 500, 10);
}

function fractalNoiseImpl(): Image {
	return fractalNoise(500, 500, 3);
}
/////

registerGenerator("Bruit de Perlin", perlinNoiseImpl);
registerGenerator("Bruit fractal", fractalNoiseImpl);

registerFilter("Rougir", red);
registerFilter("Bleuir", blue);
registerFilter("Verdir", green);
