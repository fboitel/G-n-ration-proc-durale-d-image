import { Image } from '../image';
import { pavageCarréGen, pavageTriangleGen, pavageHexaGen } from './tiling';
import {voronoi, radialDistance, signedDistance} from './distance';


type Generator<T extends any[]> = (width: number, height: number, ...params: T) => Image;

export const generators = {

    // pavages
    pavageCarréGen,
    pavageTriangleGen,
    pavageHexaGen,

    // distance
    voronoi,
    radialDistance,
    signedDistance
}