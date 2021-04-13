import { Image } from '../image';
import { red, green, blue, grayscale, brighten, darken, brightness, opacity, negative } from './colorimetry';
import { plus, minus, multiply, divide, screen, merge, blend } from './composition';
import { boxBlur, gaussianBlur, sharpen, edgeDetection } from './convolution';
import {resize, resizeAlias} from '../generators/antialias'

export type Filter<T extends any[]> = (image: Image, ...params: T) => Image;

export const filtersNew: { [category: string]: { [key: string]: Filter<any> } } = {
    colorimetry: {
        red,
        green,
        blue,
        brighten,
        darken,
        brightness,
        opacity,
        grayscale,
        negative
    },
    composition: {
        plus,
        minus,
        multiply,
        divide,
        screen,
        merge,
        blend
    },
    convolution: {
        boxBlur,
        gaussianBlur,
        sharpen,
        edgeDetection
    }
};

// DEPRECATE
export const filters: { [key: string]: Filter<any> } = {
        red,
        green,
        blue,
        brighten,
        darken,
        brightness,
        opacity,
        grayscale,
        negative,
        plus,
        minus,
        multiply,
        divide,
        merge,
        blend,
        boxBlur,
        gaussianBlur,
        sharpen,
        edgeDetection,
        resize,
        resizeAlias
};
