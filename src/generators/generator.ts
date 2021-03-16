import { Image } from '../image.js';
import { pavageCarréGen, pavageTriangleGen, pavageHexaGen } from './pavage.js';


type Generator<T extends any[]> = (...params: T) => Image;

export const generators = {
    pavageCarréGen,
    pavageTriangleGen,
    pavageHexaGen
}