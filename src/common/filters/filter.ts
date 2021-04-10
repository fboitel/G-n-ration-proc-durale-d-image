import { Image} from '../image';
import { red, green, blue, grayscale, brighten, darken, negative, blur } from './colorimetry';
import { composePlus, composeMinus, composeMultiply, composeDivide, composeMerge, composeBlend } from './composition'; 

export type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters: { [key: string]: Filter<any> } = {
    red,
    green,
    blue,
    brighten,
    darken,
    grayscale,
    negative,
    blur,
    composePlus,
    composeMinus,
    composeMultiply,
    composeDivide,
    composeMerge,
    composeBlend
};
