export type Color = number[];

const R = 0;
const G = 1;
const B = 2;
const A = 3;

// Create a color
export function consColor(r?: number, g?: number, b?: number, a: number = 255): Color {
    // Normalize a color
    function normalize(color: number[]): number[] {
        return color.map(c =>
            c < 0 ? 0 :
                c > 255 ? 255 :
                    c)
    }
    return normalize([r, g, b, a]);
}

export function getRGB(color: Color): number[] {
    return color.slice(0, 3);
}

//// Colorimetry

// Keep only the red component of a color
export function redify(color: Color): Color {
    return consColor(color[R], 0, 0, color[A]);
}

// Keep only the green component of a color
export function greenify(color: Color): Color {
    return consColor(0, color[G], 0, color[A]);
}

// Keep only the blue component of a color
export function blueify(color: Color): Color {
    return consColor(0, 0, color[B], color[A]);
}

// Convert a color to grayscale
export function gray(color: Color): Color {
    const gray = .299 * color[R] + .587 * color[G] + .114 * color[B]; // Weigthed average
    return consColor(gray, gray, gray, color[A]);
}

// Get the negative of a color
export function negateColor(color: Color): Color {
    return consColor(...getRGB(color).map(c => c ^ 255));
}

// Change the brightness of a color by the given percentage
export function setBrightness(color: Color, brightnessFactor: number): Color {
    return consColor(...getRGB(color).map(c => c * (1 + brightnessFactor / 100)));
}

// Change the contrast of a color by the given percentage
export function setContrast(color: Color, contrastFactor: number): Color {
    const correctionFactor = 259 * (contrastFactor * 255 / 100 + 255) / (255 * (259 - contrastFactor * 255 / 100));
    return consColor(...getRGB(color).map(c => correctionFactor * (c - 128) + 128));
}

// Change the opacity of a color by the given percentage
export function setOpacity(color: Color, opacityFactor: number): Color {
    return consColor(...getRGB(color), color[A] * (1 + opacityFactor / 100));
}

//// Operations

// Add two colors
export function addColor(color1: Color, color2: Color): Color {
    return consColor(...getRGB(color1).map((c, i) => c + color2[i]));
}

// Substract two colors
export function subColor(color1: Color, color2: Color): Color {
    return consColor(...getRGB(color1).map((c, i) => c - color2[i]));
}

// Multiply two colors
export function mulColor(color1: Color, color2: Color): Color {
    return consColor(...getRGB(color1).map((c, i) => c * color2[i] / 255));
}

// Divide two colors
export function divColor(color1: Color, color2: Color): Color {
    return consColor(...getRGB(color1).map((c, i) => c / color2[i]));
}

// Do the average of two colors
export function meanColor(color1: Color, color2: Color): Color {
    return consColor(...getRGB(color1).map((c, i) => (c + color2[i]) / 2));
}

export function mergeColor(color1: Color, color2: Color): Color {
    return consColor(...getRGB(color1).map((c, i) => Math.max(c, color2[i])));
}

// Do the weighted average of two colors
export function meanColorWeighted(color1: Color, p1: number, color2: Color, p2: number): Color {
    return consColor(...getRGB(color1).map((c, i) => c * p1 + color2[i] * p2));
}


//// Examples
export const WHITE: Color = consColor(255, 255, 255);
export const BLACK: Color = consColor(0, 0, 0);
export const RED: Color = consColor(255, 0, 0);
export const GREEN: Color = consColor(0, 255, 0);
export const BLUE: Color = consColor(0, 0, 255);
export const TRANSPARENT: Color = consColor(255, 255, 255, 0);
