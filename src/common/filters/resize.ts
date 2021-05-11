import { Color, meanColorWeighted } from "../color";
import { Image } from "../image";

// Rezise oldImage without interpolation
export function resize(oldImage: Image, newWidth: number, newHeight: number): Image {
	let widthCoeff = 1;
	let heightCoeff = 1;
	if (oldImage.width < newWidth) {
		widthCoeff = oldImage.width / newWidth;
	} else {
		widthCoeff = newWidth / oldImage.width;
	}

	if (oldImage.height < newHeight) {
		heightCoeff = oldImage.height / newHeight;
	} else {
		heightCoeff = newHeight / oldImage.height;
	}

	function image(x: number, y: number): Color {
		return oldImage.function(Math.floor(x * widthCoeff), Math.floor(y * heightCoeff));
	}

	return { width: newWidth, height: newHeight, function: image };
}

export function bilinearResize(oldImage: Image, newWidth: number, newHeight: number): Image {

	const widthCoeff = oldImage.width / newWidth;
	const heightCoeff = oldImage.height / newHeight;

	function image(x: number, y: number): Color {
		// https://www.iro.umontreal.ca/~mignotte/IFT6150/Chapitre7_IFT6150.pdf
		// https://www.f-legrand.fr/scidoc/docimg/image/niveaux/interpolation/interpolation.html
		// https://fr.wikipedia.org/wiki/Interpolation_multivariée
		// https://perso.esiee.fr/~perretb/I5FM/TAI/geometry/index.html
		const xcoeff = x * widthCoeff - Math.floor(x * widthCoeff);
		const ycoeff = y * heightCoeff - Math.floor(y * heightCoeff);

		x = Math.floor(x * widthCoeff);
		y = Math.floor(y * heightCoeff);

		const va = meanColorWeighted(
			oldImage.function(x, y),
			1 - ycoeff,
			oldImage.function(x, Math.min(oldImage.height - 1, y + 1)),
			ycoeff
		);
		const vb = meanColorWeighted(
			oldImage.function(Math.min(oldImage.width - 1, x + 1), y),
			1 - ycoeff,
			oldImage.function(Math.min(oldImage.width - 1, x + 1), Math.min(oldImage.height - 1, y + 1)),
			ycoeff
		);

		const vt = meanColorWeighted(va, 1 - xcoeff, vb, xcoeff);

		return vt;
	}
	return { width: newWidth, height: newHeight, function: image };
}