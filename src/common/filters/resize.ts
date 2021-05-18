import { Color, meanColorWeighted } from "../color";
import { consImage, Image } from "../image";

/**
 * Rezise image with interpolation
 * @param image Image to resize
 * @param newWidth Width for the new image
 * @param newHeight Height for the new image
 * @returns The given image resized with the given dimensions
 */
export function resize(image: Image, newWidth: number, newHeight: number): Image {
	let widthCoeff = 1;
	let heightCoeff = 1;

	widthCoeff = image.width < newWidth ? image.width / newWidth : newWidth / image.width;
	heightCoeff = image.height < newHeight ? image.height / newHeight : newHeight / image.height;

	function newFunction(x: number, y: number): Color {
		return image.function(Math.floor(x * widthCoeff), Math.floor(y * heightCoeff));
	}

	return consImage(newWidth, newHeight, newFunction);
}

/**
 * Rezise image with bilinear interpolation
 * @param image Image to resize
 * @param newWidth Width for the new image
 * @param newHeight Height for the new image
 * @returns The given image resized with the given dimensions
 */
export function bilinearResize(image: Image, newWidth: number, newHeight: number): Image {
	const widthCoeff = image.width / newWidth;
	const heightCoeff = image.height / newHeight;

	function newFunction(x: number, y: number): Color {
		// https://www.iro.umontreal.ca/~mignotte/IFT6150/Chapitre7_IFT6150.pdf
		// https://www.f-legrand.fr/scidoc/docimg/image/niveaux/interpolation/interpolation.html
		// https://fr.wikipedia.org/wiki/Interpolation_multivariée
		// https://perso.esiee.fr/~perretb/I5FM/TAI/geometry/index.html
		const xcoeff = x * widthCoeff - Math.floor(x * widthCoeff);
		const ycoeff = y * heightCoeff - Math.floor(y * heightCoeff);

		x = Math.floor(x * widthCoeff);
		y = Math.floor(y * heightCoeff);

		const va = meanColorWeighted(
			image.function(x, y),
			1 - ycoeff,
			image.function(x, Math.min(image.height - 1, y + 1)),
			ycoeff
		);
		const vb = meanColorWeighted(
			image.function(Math.min(image.width - 1, x + 1), y),
			1 - ycoeff,
			image.function(Math.min(image.width - 1, x + 1), Math.min(image.height - 1, y + 1)),
			ycoeff
		);

		const vt = meanColorWeighted(va, 1 - xcoeff, vb, xcoeff);

		return vt;
	}

	return consImage(newWidth, newHeight, newFunction);
}
