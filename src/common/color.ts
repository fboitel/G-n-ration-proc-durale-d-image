export type Color = number[];

export const R = 0;
export const G = 1;
export const B = 2;
export const A = 3;

// Create a color
export function consColor(r?: number, g?: number, b?: number, a: number = 255): Color {
    return [r, g, b, a].map(c => Math.max(0, Math.min(255, c)));
}

export function getRGB(color: Color): number[] {
    return color.slice(0, 3);
}

export function grayLevel(color: Color): number {
    // Weighted average
    return .299 * color[R] + .587 * color[G] + .114 * color[B];
}

// Get the negative of a color
export function negateColor(color: Color): Color {
    return consColor(...getRGB(color).map(c => c ^ 255));
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
