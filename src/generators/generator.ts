import { Image } from '../image';
import { pavageCarréGen, pavageTriangleGen, pavageHexaGen } from './pavage';


type Generator<T extends any[]> = (...params: T) => Image;

export const generators = {
    pavageCarréGen,
    pavageTriangleGen,
    pavageHexaGen
}