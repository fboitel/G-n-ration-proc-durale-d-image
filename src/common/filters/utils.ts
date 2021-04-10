import { Image, consImage } from '../image';
import { Color } from '../color';

export function applyFunction(image: Image, func: (color: Color) => Color): Image {
    return consImage(
        image.width,
        image.height,
        (x, y) => func(image.function(x, y))
    );
}

export function composeFunction(image1: Image, image2: Image, func: (c1: Color, c2: Color) => Color): Image {
    return consImage(
        Math.min(image1.width, image2.width),
        Math.min(image1.height, image2.height),
        (x, y) => func(image1.function(x, y), image2.function(x, y))
    );
}
