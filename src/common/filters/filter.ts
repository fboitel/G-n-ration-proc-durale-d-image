import { Image} from '../image';
import { red, green, blue, grayscale, brighten, darken, negative } from './colorimetry';
import { composePlus, composeMinus, composeMultiply, composeDivide, composeMerge, composeBlend } from './composition'; 
import { boxBlur, gaussianBlur, sharpen, edgeDetection } from './convolution';

export type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filters: { [key: string]: Filter<any> } = {
    red,
    green,
    blue,
    brighten,
    darken,
    grayscale,
    negative,
    boxBlur,
    gaussianBlur,
    sharpen,
    edgeDetection,
    composePlus,
    composeMinus,
    composeMultiply,
    composeDivide,
    composeMerge,
    composeBlend
};
