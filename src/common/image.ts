import { Color, consColor, getRed, getGreen, getBlue, getAlpha } from './color';
import { writeFileSync } from 'fs';
import { createCanvas, createImageData, loadImage } from 'canvas';

export interface Image {
    width: number;
    height: number;
    function: (x: number, y: number) => Color;
}

// Create an image
export function consImage(width: number, height: number, func: (x: number, y: number) => Color): Image {
    return {
        width,
        height,
        function: func
    }
}

// Convert an functional image to ImageData
export function toRaster(img: Image, imageDataConstructor: (width: number, height: number) => ImageData): ImageData {
    const raster = imageDataConstructor(img.width, img.height);
    let n = 0; // Index inside the image array

    for (let y = 0; y < img.height; ++y) {
        for (let x = 0; x < img.width; ++x) {
            const color = img.function(x, y)
            raster.data[n++] = getRed(color);
            raster.data[n++] = getGreen(color);
            raster.data[n++] = getBlue(color);
            raster.data[n++] = getAlpha(color);
        }
    }
    
    return raster;
}

// Load a local image and convert it to a functional image
export async function loadFromFile(path: string): Promise<Image> {
    // Load the image
    const img = await loadImage(path);

    // Draw the image in canvas
    const canvas = createCanvas(img.width, img.height);
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    // Get image data from the file
    const raster = context.getImageData(0, 0, img.width, img.height);
    const { width, height, data } = raster;

    // Return the functional image
    return consImage(width, height, (x: number, y: number) => {
        let px = (y * width + x) * 4;
        return consColor(data[px], data[px + 1], data[px + 2], data[px + 3])
    });
}

// Save an image as PNG
export function saveToPNG(img: Image, title: string) {
    const canvas = createCanvas(img.width, img.height);
    const context = canvas.getContext('2d');
    context.putImageData(toRaster(img, createImageData), 0, 0);
    const buffer = canvas.toBuffer('image/png');

    writeFileSync(`public/${title}.png`, buffer);
}
