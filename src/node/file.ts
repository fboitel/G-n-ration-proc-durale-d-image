import { Image, fromRaster, toRaster } from '../common/image';
import { writeFileSync } from 'fs';
import { createCanvas, createImageData, loadImage } from 'canvas';

/**
 * Load a local image and convert it to a functional image
 */	
export async function loadFromFile(path: string): Promise<Image> {
	// Load the image
	const img = await loadImage(path);

	// Draw the image in canvas
	const canvas = createCanvas(img.width, img.height);
	const context = canvas.getContext('2d');
	context.drawImage(img, 0, 0);

	// Get image data from the file
	const raster = context.getImageData(0, 0, img.width, img.height);

	// Return the functional image
	return fromRaster(raster);
}

/**
 * Save an image as PNG
 */ 
export function saveToPNG(img: Image, title: string): void {
	const canvas = createCanvas(img.width, img.height);
	const context = canvas.getContext('2d');
	context.putImageData(toRaster(img, createImageData), 0, 0);
	const buffer = canvas.toBuffer('image/png');

	writeFileSync(`public/${title}.png`, buffer);
}
