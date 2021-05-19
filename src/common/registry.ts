import { Generator, Filter } from './image';
import { fractalNoise, perlinNoise, whiteNoise } from './generators/noise';
import { hexaTilingGen, pentagonalTilingType1Gen, rotate, snubSquareTilingGen, squareTilingGen, translate, triangleTilingGen, truncatedTrihexagonalTilingGen } from './generators/tiling';
import { radialDistance, signedDistance, voronoi } from './generators/distance';
import { Parameter, ParameterType } from './parameters';
import { BLACK, consColor, GREEN, WHITE } from './color';
import { red, green, blue, colorize, grayScale, brightness, contrast, opacity, negative } from './filters/colorimetry';
import { boxBlur, edgeDetection, gaussianBlur, sharpen } from './filters/convolution';
import { plus, minus, multiply, divide, merge } from './filters/composition';
import { bilinearResize, resize } from './filters/resize';
import { drawLine } from './generators/shapes';
import { nextForest } from './generators/numericalSimulation';

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

export type Registry<T> = { [key: string]: T };

export const generators: Registry<GeneratorMeta> = {};
export const filters: Registry<FilterMeta> = {};

function registerGenerator(name: string, generator: Generator<any>, ...parameters: Parameter<any>[]) {
	generators[generator.name] = { name, generator, parameters };
}

function registerFilter(name: string, filter: Filter<any>, additionalInputs = 0, ...parameters: Parameter<any>[]) {
	filters[filter.name] = { name, filter, additionalInputs, parameters };
}

// Noises
registerGenerator('Bruit blanc', whiteNoise);
registerGenerator('Bruit de Perlin', perlinNoise, { type: ParameterType.NUMBER, name: 'Taille', default: 30 });
registerGenerator('Bruit fractal', fractalNoise, { type: ParameterType.NUMBER, name: 'Couches', default: 3 });

// Tilings
registerGenerator('Pavage carré', squareTilingGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 5 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) });
registerGenerator('Pavage triangle', triangleTilingGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 5 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) });
registerGenerator('Pavage héxagonal', hexaTilingGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 5 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) }, { type: ParameterType.COLOR, name: 'Troisième couleur', default: consColor(0, 255, 122) });
registerGenerator('Pavage carré adouci', snubSquareTilingGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 5 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) }, { type: ParameterType.COLOR, name: 'Troisième couleur', default: consColor(0, 255, 122) });
registerGenerator('Pavage grand rhombitrihexagonal', truncatedTrihexagonalTilingGen, { type: ParameterType.NUMBER, name: 'Nombre de motifs', default: 10 }, { type: ParameterType.COLOR, name: 'Première couleur', default: consColor(122, 0, 255) }, { type: ParameterType.COLOR, name: 'Seconde couleur', default: consColor(255, 122, 0) }, { type: ParameterType.COLOR, name: 'Troisième couleur', default: consColor(0, 255, 122) });
registerGenerator('Pavage pentagonal de type 1', pentagonalTilingType1Gen, { type: ParameterType.NUMBER, name: 'Longueur 1', default: 80 }, { type: ParameterType.NUMBER, name: 'Longueur 2', default:150}, { type: ParameterType.NUMBER, name: 'Longueur 3', default: 200}, { type: ParameterType.NUMBER, name: 'Longueur 4', default: 70 }, { type: ParameterType.NUMBER, name: 'Angle 1 (DEG)', default:110}, { type: ParameterType.NUMBER, name: 'Angle 2 (DEG)', default:150}, { type: ParameterType.NUMBER, name: 'Scale', default: 100}, { type: ParameterType.COLOR, name: 'Couleur des traits', default: consColor(0, 0, 0) }, { type: ParameterType.COLOR, name: 'Couleur principale', default: consColor(0, 255, 122) } );

// Distances
registerGenerator('Diagrammes de Voronoi', voronoi, { type: ParameterType.NUMBER, name: 'Nombre de points', default: 10 });
registerGenerator('Distance radiale', radialDistance, { type: ParameterType.COLOR, name: 'Couleur de départ', default: BLACK }, { type: ParameterType.COLOR, name: 'Couleur de fin', default: WHITE }, { type: ParameterType.NUMBER, name: 'Centre X', default: 0 }, { type: ParameterType.NUMBER, name: 'Centre Y', default: 0 }, { type: ParameterType.BOOLEAN, name: 'Inscrit', default: false } );
registerGenerator('Distance signée', signedDistance, { type: ParameterType.COLOR, name: 'Couleur de départ', default: BLACK }, { type: ParameterType.COLOR, name: 'Couleur de fin', default: WHITE }, { type: ParameterType.NUMBER, name: 'Centre X', default: 0 }, { type: ParameterType.NUMBER, name: 'Centre Y', default: 0 }, { type: ParameterType.NUMBER, name: 'Largeur', default: 100 }, { type: ParameterType.NUMBER, name: 'Hauteur', default: 100 }, { type: ParameterType.BOOLEAN, name: 'Inscrit', default: false } );

// Shapes
registerGenerator('Ligne', drawLine, { type: ParameterType.NUMBER, name: 'Debut X', default: 0 }, { type: ParameterType.NUMBER, name: 'Debut Y', default: 0 }, { type: ParameterType.NUMBER, name: 'Fin X', default: 100 }, { type: ParameterType.NUMBER, name: 'Fin Y', default: 100 }, { type: ParameterType.NUMBER, name: 'Epaisseur', default: 2 } );

// Numerical simulation

registerGenerator('Forest-Fire', nextForest, {type : ParameterType.NUMBER, name: 'Probability that a tree grow in an empty space (in per million)', default: 8000}, { type : ParameterType.NUMBER, name: 'Probability that a single tree ignites (in per million)', default: 5 }, { type : ParameterType.NUMBER, name: 'time', default: 0});//, { type: ParameterType.NUMBER, name: 't', default: 0 })

// Colorimetry
registerFilter('Canal rouge', red);
registerFilter('Canal bleu', blue);
registerFilter('Canal vert', green);
registerFilter('Colorer', colorize, 0, { type: ParameterType.COLOR, name: 'Couleur', default: GREEN });
registerFilter('Niveaux de gris', grayScale);
registerFilter('Luminosité', brightness, 0, { type: ParameterType.NUMBER, name: 'Pourcentage', default: 100 });
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

// Resizing
registerFilter('Redimensionner', resize, 0, { type: ParameterType.NUMBER, name: 'Largeur', default: 500 },  { type: ParameterType.NUMBER, name: 'Hauteur', default: 500 });
registerFilter('Redimensionner bilinéairement', bilinearResize, 0, { type: ParameterType.NUMBER, name: 'Largeur', default: 500 },  { type: ParameterType.NUMBER, name: 'Hauteur', default: 500 });
registerFilter('Rotation sur pavage ', rotate, 0,{ type: ParameterType.NUMBER, name: 'angle (DEG)(in [0, 90])', default: 50 });
registerFilter('Translation sur pavage', translate, 0, { type: ParameterType.NUMBER, name: 'abscisse (> 0)', default: 50 }, { type: ParameterType.NUMBER, name: 'ordonnée (> 0)', default: 50 });
