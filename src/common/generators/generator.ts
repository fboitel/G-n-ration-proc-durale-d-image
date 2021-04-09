import { Image } from '../image';
import { monochromaticRed, monochromaticGreen, monochromaticBlue } from './monocromatic'
import { pavageCarreGen, pavageTriangleGen, pavageHexaGen } from './tiling';
import {voronoi, radialDistance, signedDistance} from './distance';


export type Generator<T extends any[]> = (width: number, height: number, ...params: T) => Image;

export const generators:{ [key: string] : Generator<any>} = {

    // monochromatic
    monochromaticRed,
    monochromaticGreen,
    monochromaticBlue,

    // pavages
    pavageCarreGen,
    pavageTriangleGen,
    pavageHexaGen,

    // distance
    voronoi,
    radialDistance,
    signedDistance
}