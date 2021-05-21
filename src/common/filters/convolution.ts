import { Color, consColor, R, G, B } from '../color';
import { Image, consImage } from '../image';

type Kernel = number[];

// Filter kernels
const boxBlurKernel: Kernel = Array(9).fill(1).map(el => el / 9);
const gaussianBlurKernel: Kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1].map(el => el / 16);
const edgeDetectionKernel: Kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];
const sharpenKernel: Kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

/**
 * Check if a pixel (x, y) is in the image
 * @param image Any image
 * @param x x coordinates of the pixel
 * @param y y coordinates of the pixel
 * @returns true if pixel (x, y) is inside the image, else false
 */
function isValidPixel(image: Image, x: number, y: number): boolean {
	return x >= 0 && x < image.width && y >= 0 && y < image.height;
}

/**
 * Handle edge overtake
 * Handle method is zero-padding
 * @returns A color representing an outside pixel
 */
function handleEdge(): Color {
	return consColor(0, 0, 0);
}

/**
 * Get the adjacent pixels colors of a given pixel
 * @param image Any image
 * @param x x coordinates of the pixel
 * @param y y coordinates of the pixel
 * @returns A matrix of the adjacent pixels colors
 */
function getNeighborhood(image: Image, x: number, y: number): Color[] {
	const neighborhood: Color[] = [];
	for (let i = x - 1; i <= x + 1; i++) {
		for (let j = y - 1; j <= y + 1; j++) {
			neighborhood.push(isValidPixel(image, i, j) ? image.function(i, j) : handleEdge());
		}
	}
	return neighborhood;
}

/**
 * Do a convolution product between a kernel and the neighbors of a pixel
 * @param image Any image
 * @param x x coordinates of the pixel
 * @param y y coordinates of the pixel
 * @param kernel The kernel to apply
 * @returns The color of the pixel after the convolution product
 */
function applyKernel(image: Image, x: number, y: number, kernel: Kernel): Color {
	const neighborhood = getNeighborhood(image, x, y);
	return consColor(
		neighborhood.reduce((acc, c, i) => acc += c[R] * kernel[i], 0),
		neighborhood.reduce((acc, c, i) => acc += c[G] * kernel[i], 0),
		neighborhood.reduce((acc, c, i) => acc += c[B] * kernel[i], 0)
	);
}

/**
 * Do a convolution between an image and a kernel
 * @param image The image to filter
 * @param kernel The kernel used for the convolution
 * @returns A new image representing the convolution of the given image with the given kernel
 */
function convolution(image: Image, kernel: Kernel): Image {
	return consImage(
		image.width,
		image.height,
		(x, y) => applyKernel(image, x, y, kernel)
	);
}

/**
 * Blur an image with box blur
 * @param image The image to filter
 * @returns The given image blurred
 */
export function boxBlur(image: Image): Image {
	return convolution(image, boxBlurKernel);
}

/**
 * Blur an image with gaussian blur
 * @param image The image to filter
 * @returns The given image blurred
 */
export function gaussianBlur(image: Image): Image {
	return convolution(image, gaussianBlurKernel);
}

/**
 * Sharpen an image
 * @param image The image to filter
 * @returns The given image sharpened
 */
export function sharpen(image: Image): Image {
	return convolution(image, sharpenKernel);
}

/**
 * Perform edge detection on an image
 * @param image The image to filter
 * @returns An image representing the given image edges
 */
export function edgeDetection(image: Image): Image {
	return convolution(image, edgeDetectionKernel);
}
