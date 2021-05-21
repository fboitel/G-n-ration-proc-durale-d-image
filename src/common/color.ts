export type Color = number[];

export const R = 0;
export const G = 1;
export const B = 2;
export const A = 3;

/**
 * Create a color with the RBGA representation
 * If color channels are invalid (i.e < 0 or > 255) they are normalized to the corresponding bound
 * @param r Red channel
 * @param g Green channel
 * @param b Blue channel
 * @param a Alpha channel
 * @returns The representation of a color
 */
export function consColor(r: number, g: number, b: number, a = 255): Color {
	return [r, g, b, a].map(c => Math.max(0, Math.min(255, c)));
}

/**
 * Return the hex code of a color
 * @param color Color to convert
 * @returns A hex string representing the given color
 */
export function colorToHex(color: Color): string {
	return '#' + (color[A] === 255 ? getRGB(color) : color).map(c => {
		let str = c.toString(16);
		if (str.length === 1) {
			str = '0' + str;
		}
		return str;
	}).join('');
}

/**
 * Return a color given its hex code
 * @param hex Hex code of a color
 * @returns The color represented by the given hex string
 */
export function hexToColor(hex: string): Color | null {
	const match = hex.match(/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})((?:[0-9A-F]{2})?)$/i);

	if (!match) {
		return null;
	}

	const r = parseInt(match[1], 16);
	const g = parseInt(match[2], 16);
	const b = parseInt(match[3], 16);
	const a = match[4] ? parseInt(match[4], 16) : 255;

	return consColor(r, g, b, a);
}

/**
 * Map a color with a callback function
 * @param color Color to map
 * @param mapper Callback function
 * @returns The color resulting from the mapping
 */
export function mapColor(color: Color, mapper: (channel: number, index: number) => number): Color {
	return consColor(mapper(color[R], R), mapper(color[G], G), mapper(color[B], B), color[A]);
}

/**
 * Get the RGB channels of a color
 * @param color Any color
 * @returns An array of the red, blue and green color's channels
 */
export function getRGB(color: Color): number[] {
	return color.slice(0, 3);
}

/**
 * Compute the grayscale of a color
 * @param color Any color
 * @returns A color which is the grayscale of the given color
 */
export function grayLevel(color: Color): number {
	// Weighted average
	return .299 * color[R] + .587 * color[G] + .114 * color[B];
}

/**
 * Compute the negative of a color
 * @param color Any color
 * @returns A color which is the negative of the given color
 */
export function negateColor(color: Color): Color {
	return mapColor(color, c => c ^ 255);
}

//// Arithmetics operations

/**
 * Add two colors by adding the the red, green and blue channel of the first color
 * with the red, green and blue channel of the second color respectively
 * @param color1 First color
 * @param color2 Second color
 * @returns A new color which is the addition of the given colors
 */
export function addColor(color1: Color, color2: Color): Color {
	return mapColor(color1, (c, i) => c + color2[i]);
}

/**
 * Subtract two colors by subtracting the red, green and blue channel of the first color
 * by the red, green and blue channel of the second color respectively
 * @param color1 First color
 * @param color2 Second color
 * @returns A new color which is the substraction of the given colors
 */
export function subColor(color1: Color, color2: Color): Color {
	return mapColor(color1, (c, i) => c - color2[i]);
}

/**
 * Multiply two colors by multiplying the red, green and blue channel of the first color
 * with the red, green and blue channel of the second color respectively
 * @param color1 First color
 * @param color2 Second color
 * @returns A new color which is the multiplication of the given colors
 */
export function mulColor(color1: Color, color2: Color): Color {
	return mapColor(color1, (c, i) => c * color2[i] / 255);
}

// Divide two colors
/**
 * Divide two colors by dividing the red, green and blue channel of the first color
 * by the red, green and blue channel of the second color respectively
 * @param color1 First color
 * @param color2 Second color
 * @returns A new color which is the division of the given colors
 */
export function divColor(color1: Color, color2: Color): Color {
	return mapColor(color1, (c, i) => c / color2[i]);
}

/**
 * Average two colors by averaging the red, green and blue channel of the first color
 * with the red, green and blue channel of the second color respectively
 * @param color1 First color
 * @param color2 Second color
 * @returns A new color which is the average of the given colors
 */
export function meanColor(color1: Color, color2: Color): Color {
	return mapColor(color1, (c, i) => (c + color2[i]) / 2);
}

/**
 * Average two colors with a weighted coefficient, by averaging the red, green and blue channel
 * of the first color with the red, green and blue channel of the second color respectively
 * @param color1 First color
 * @param color2 Second color
 * @returns A new color which is the weighted average of the given colors
 */
export function meanColorWeighted(color1: Color, p1: number, color2: Color, p2: number): Color {
	return mapColor(color1, (c, i) => c * p1 + color2[i] * p2);
}

/**
 * Merge two colors by getting the maximum component value between the two colors for each channel
 * @param color1 First color
 * @param color2 Second color
 * @returns A new color which is the merging of the given colors
 */
export function mergeColor(color1: Color, color2: Color): Color {
	return mapColor(color1, (c, i) => Math.max(c, color2[i]));
}

//// Color constants
export const WHITE: Color = consColor(255, 255, 255);
export const BLACK: Color = consColor(0, 0, 0);
export const RED: Color = consColor(255, 0, 0);
export const GREEN: Color = consColor(0, 255, 0);
export const BLUE: Color = consColor(0, 0, 255);
export const TRANSPARENT: Color = consColor(255, 255, 255, 0);
