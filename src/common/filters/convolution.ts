import { Color, consColor } from '../color';
import { Image, consImage } from '../image';

type Kernel = number[];

// Filter kernels
const boxBlurKernel: Kernel = Array(9).fill(1).map(el => el / 9);
const gaussianBlurKernel: Kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1].map(el => el / 16);
const edgeDetectionKernel: Kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];
const sharpenKernel: Kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

// Check if a pixel (x, y) is in the image
function isValidPixel(image: Image, x: number, y: number): boolean {
	return x >= 0 && x < image.width && y >= 0 && y < image.height;
}

// Handle edge by zero-padding
function handleEdge(): Color {
	return consColor(0, 0, 0);
}

// Get a matrix of the adjacent pixel colors
function getNeighborhood(image: Image, x: number, y: number): Color[] {
	const neighborhood: Color[] = [];
	for (let i = x - 1; i <= x + 1; i++) {
		for (let j = y - 1; j <= y + 1; j++) {
			neighborhood.push(isValidPixel(image, i, j) ? image.function(i, j) : handleEdge());
		}
	}
	return neighborhood;
}

// Apply a kernel on a pixel
function applyKernel(x: number, y: number, image: Image, kernel: Kernel): Color {
	const neighborhood = getNeighborhood(image, x, y);
	return consColor(
		neighborhood.reduce((acc, c, i) => acc += c[0] * kernel[i], 0),
		neighborhood.reduce((acc, c, i) => acc += c[1] * kernel[i], 0),
		neighborhood.reduce((acc, c, i) => acc += c[2] * kernel[i], 0)
	);
}

// Do a convolution between an image and a kernel
function convolution(image: Image, kernel: Kernel): Image {
	return consImage(image.width,
		image.height,
		(x, y) => applyKernel(x, y, image, kernel)
	);
}

// Blur an image with box blur
export function boxBlur(image: Image): Image {
	return convolution(image, boxBlurKernel);
}

// Blur an image with gaussian blur
export function gaussianBlur(image: Image): Image {
	return convolution(image, gaussianBlurKernel);
}

// Sharpen an image
export function sharpen(image: Image): Image {
	return convolution(image, sharpenKernel);
}

// Perform edge detection on an image
export function edgeDetection(image: Image): Image {
	return convolution(image, edgeDetectionKernel);
}
