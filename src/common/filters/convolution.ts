import { Color, consColor, getRed, getGreen, getBlue } from '../color';
import { Image, consImage } from '../image';

export type Kernel = number[];

const boxBlurKernel = Array(9).fill(1).map(el => el / 9);
const gaussianBlurKernel = [1, 2, 1, 2, 4, 2, 1, 2, 1].map(el => el / 16);
const edgeDetectionKernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
const sharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

// Check if a pixel is in the image
function isValidPixel(image: Image, x: number, y: number): boolean {
    return x >= 0 && x < image.width && y >= 0 && y < image.height;
}

// Handle edge by zero-padding
function handleEdge(image: Image, x: number, y: number): Color {
    return consColor(0, 0, 0);
}

// Get a matrix of the adjacent pixel colors
function getNeighborhood(image: Image, x: number, y: number): Color[] {
    const neighborhood: Color[] = [];
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            neighborhood.push(isValidPixel(image, i, j) ? image.function(i, j) : handleEdge(image, i, j));
        }
    }
    return neighborhood;
}

// Apply a kernel on a pixel
function applyKernel(x: number, y: number, image: Image, kernel: Kernel): Color {
    const neighborhood = getNeighborhood(image, x, y);
    return consColor(
        neighborhood.reduce((acc, c, i) => acc += getRed(c) * kernel[i], 0),
        neighborhood.reduce((acc, c, i) => acc += getGreen(c) * kernel[i], 0),
        neighborhood.reduce((acc, c, i) => acc += getBlue(c) * kernel[i], 0)
    );
}

function convolution(image: Image, kernel: Kernel): Image {
    return consImage(image.width,
        image.height,
        (x, y) => applyKernel(x, y, image, kernel)
    );
}


// Blur an image
export function boxBlur(image: Image): Image {
    return convolution(image, boxBlurKernel);
}

export function gaussianBlur(image: Image): Image {
    return convolution(image, gaussianBlurKernel);
}

// Sharpen an image
export function sharpen(image: Image): Image {
    return convolution(image, sharpenKernel);
}

export function edgeDetection(image: Image): Image {
    return convolution(image, edgeDetectionKernel);
}
