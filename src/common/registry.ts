import { Filter } from './filters/filter';
import { Generator } from './generators/generator';
import { fractalNoise, perlinNoise } from './generators/noise';
import { pavageCarreAdouciGen, pavageGrandRhombitrihexagonalGen, pavageHexaGen, pavageTriangleGen } from './generators/tiling'
import { Parameter, ParameterType } from './parameters';
import { BLUE, consColor, GREEN } from './color';
import { red, green, blue, colorize, grayScale, brightness, contrast, opacity, negative } from './filters/colorimetry';
import { boxBlur, edgeDetection, gaussianBlur, sharpen } from './filters/convolution';
import { plus, minus, multiply, divide, screen, merge } from './filters/composition';

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

export type Registry<T> = { [key: string]: T }

export const generators: Registry<GeneratorMeta> = {}
export const filters: Registry<FilterMeta> = {}

function registerGenerator(name: string, generator: Generator<any>, ...parameters: Parameter<any>[]) {
    generators[generator.name] = { name, generator, parameters };
}

function registerFilter(name: string, filter: Filter<any>, additionalInputs = 0, ...parameters: Parameter<any>[]) {
    filters[filter.name] = { name, filter, additionalInputs, parameters };
}

registerGenerator('Bruit de Perlin', perlinNoise, { type: ParameterType.NUMBER, name: 'Taille', default: 30 });
registerGenerator('Bruit fractal', fractalNoise, { type: ParameterType.NUMBER, name: 'Couches', default: 3 });

registerGenerator('Pavage triangle', pavageTriangleGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 5 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) })
registerGenerator('Pavage carré adouci', pavageCarreAdouciGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 5 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) }, { type: ParameterType.COLOR, name: 'Troisième couleur', default: consColor(0, 255, 122) })
registerGenerator('Pavage grand rhombitrihexagonal', pavageGrandRhombitrihexagonalGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 10 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) }, { type: ParameterType.COLOR, name: 'Troisième couleur', default: consColor(0, 255, 122) })

// Colorimetry
registerFilter('Canal rouge', red);
registerFilter('Canal bleu', blue);
registerFilter('Canal vert', green);
registerFilter('Colorer', colorize, 0, { type: ParameterType.COLOR, name: 'Couleur', default: GREEN });
registerFilter('Niveaux de gris', grayScale);
registerFilter('Luminosité', brightness, 0, { type: ParameterType.NUMBER, name: 'Pourcentage', default: 0 });
registerFilter('Contraste', contrast,  0, { type: ParameterType.NUMBER, name: 'Pourcentage', default: 0 });
registerFilter('Transparence', opacity,  0, { type: ParameterType.NUMBER, name: 'Pourcentage', default: 100 });
registerFilter('Negatif', negative);

// Convolution
registerFilter('Flou', boxBlur);
registerFilter('Flou de Gauss', gaussianBlur);
registerFilter('Affiner', sharpen);
registerFilter('Détection des contours', edgeDetection);

// Composition
registerFilter('Ajouter', plus, 1);
registerFilter('Soustraire', minus, 1);
registerFilter('Multiplier', multiply, 1);
registerFilter('Diviser', divide, 1);
registerFilter('Fusionner', merge, 1);
