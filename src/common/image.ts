import { Color, consColor } from './color';

export interface Image {
    width: number;
    height: number;
    function: (x: number, y: number) => Color;
}

export interface ImageDataCommon {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

// Create an image
export function consImage(width: number, height: number, func: (x: number, y: number) => Color): Image {
    return {
        width,
        height,
        function: func
    }
}

// Convert a functional image to ImageData
export function toRaster(img: Image, imageDataConstructor: (width: number, height: number) => ImageDataCommon): ImageDataCommon {
    const raster = imageDataConstructor(img.width, img.height);
    let n = 0; // Index inside the image array

    for (let y = 0; y < img.height; ++y) {
        for (let x = 0; x < img.width; ++x) {
            const color = img.function(x, y);
            raster.data[n++] = color[0];
            raster.data[n++] = color[1];
            raster.data[n++] = color[2];
            raster.data[n++] = color[3];
        }
    }
    return raster;
}

// Convert ImageData to a functional image
export function fromRaster(raster: ImageDataCommon): Image {
    const { width, height, data } = raster;

    return consImage(width, height, (x: number, y: number) => {
        let px = (y * width + x) * 4;
        return consColor(data[px], data[px + 1], data[px + 2], data[px + 3]);
    });
}
