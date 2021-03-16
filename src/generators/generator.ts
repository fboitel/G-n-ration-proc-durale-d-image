import { Image } from '../image.js';
import { pavageCarréGen, pavageTriangleGen, pavageHexaGen } from './pavage.js';
import {voronoi, radialDistance} from './distance';


type Generator<T extends any[]> = (...params: T) => Image;

export const generators = {

    // pavages
    pavageCarréGen,
    pavageTriangleGen,
    pavageHexaGen,

    // distance
    voronoi,
    radialDistance
}