export type Color = number[];


//// API

// Create a color
export function color(r: number, g: number, b: number, a: number = 255): Color {
    return [r, g, b, a];
}

// Get red component of a color
export function getRed(c: Color) {
    return c[0];
}

// Get green component of a color
export function getGreen(c: Color) {
    return c[1];
}

// Get blue component of a color
export function getBlue(c: Color) {
    return c[2];
}

// Get alpha component of a color
export function getAlpha(c: Color) {
    return c[3];
}

// Normalize a color
export function normalize(color: Color): Color {
    return color.map(c =>
        c < 0 ? 0 :
            c > 255 ? 255 :
                c)
}

//// Colorimetry

// Keep only the red component of a color
export function redify(c: Color): Color {
    return color(getRed(c), 0, 0, getAlpha(c));
}

// Keep only the green component of a color
export function greenify(c: Color): Color {
    return color(0, getGreen(c), 0, getAlpha(c));
}

// Keep only the blue component of a color
export function blueify(c: Color): Color {
    return color(0, 0, getBlue(c), getAlpha(c));
}

// Get the negative of a color
export function negate(c: Color): Color {
    return color(255 - getRed(c), 255 - getGreen(c), 255 - getRed(c), getAlpha(c));
}

export function opacite(c: Color): Color {
    c[c.length - 1] = 255;
    return c;
}

export function transparent(c: Color): Color {
    c[-1] /= 2;
    return c;
}


//// Operations

// Add two colors
export function plus(c1: Color, c2: Color): Color {
    return normalize(c1.map((c, i) => c + c2[i]));
}

// Substract two colors
export function minus(c1: Color, c2: Color): Color {
    return normalize(opacite(c1.map((c, i) => c - c2[i])));
}

// Multiply two colors
export function multiply(c1: Color, c2: Color): Color {
    return normalize(c1.map((c, i) => c * c2[i]));
}

// Divide two colors
export function divide(c1: Color, c2: Color): Color {
    return normalize(c1.map((c, i) => c / c2[i]));
}

// Do the average of two colors
export function mean(c1: Color, c2: Color): Color {
    return c1.map((c, i) => (c + c2[i]) / 2);
}

// Do the weighted average of two colors
export function meanWeighted(c1: Color, p1: number, c2: Color, p2: number) {

    function callback(c: number, i: number) {
        if (i < 3) {
            return c * p1 + c2[i] * p2;
        }
        return c;
    }
    return c1.map(callback);
}


//// Examples
export const WHITE: Color = color(255, 255, 255);
export const BLACK: Color = color(0, 0, 0);
export const RED: Color = color(255, 0, 0);
export const GREEN: Color = color(0, 255, 0);
export const BLUE: Color = color(0, 0, 255);
export const TRANSPARENT: Color = color(255, 255, 255, 0);