import { Image } from '../image';
import { pavageCarreGen, pavageTriangleGen, pavageHexaGen } from './tiling';
import {voronoi, radialDistance, signedDistance} from './distance';


type Generator<T extends any[]> = (width: number, height: number, ...params: T) => Image;

export const generators = {

    // pavages
    pavageCarreGen,
    pavageTriangleGen,
    pavageHexaGen,

    // distance
    voronoi,
    radialDistance,
    signedDistance
}