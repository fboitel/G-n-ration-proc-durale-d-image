export type Color = number[];

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

// Get red component of a color
export function getRed(c: Color): number {
    return c[0];
}

// Get green component of a color
export function getGreen(c: Color): number {
    return c[1];
}

// Get blue component of a color
export function getBlue(c: Color): number {
    return c[2];
}

// Get alpha component of a color
export function getAlpha(c: Color) {
    return c[3];
}

export function getRGB(c: Color): [number, number, number] {
    return [getRed(c), getGreen(c), getBlue(c)];
}

//// Colorimetry

// Keep only the red component of a color
export function redify(c: Color): Color {
    return consColor(getRed(c), 0, 0, getAlpha(c));
}

// Keep only the green component of a color
export function greenify(c: Color): Color {
    return consColor(0, getGreen(c), 0, getAlpha(c));
}

// Keep only the blue component of a color
export function blueify(c: Color): Color {
    return consColor(0, 0, getBlue(c), getAlpha(c));
}

export function gray(c: Color): Color {
    const average = (getRed(c) + getGreen(c) + getBlue(c)) / 3;
    return consColor(average, average, average, getAlpha(c));
}

// Get the negative of a color
export function negateColor(c: Color): Color {
    return consColor(getRed(c) ^ 255, getGreen(c) ^ 255, getBlue(c) ^ 255, getAlpha(c));
}

// Change the brightness of a color by the given factor
export function setBrightness(c: Color, brightnessFactor: number): Color {
    return consColor(...getRGB(c).map(cmp => cmp * (1 + brightnessFactor)));
}

// Change the opacity of a color by the given factor
export function setOpacity(c: Color, opacityFactor: number): Color {
    return consColor(...getRGB(c), getAlpha(c) * (1 + opacityFactor));
}

//// Operations

// Add two colors
export function addColor(c1: Color, c2: Color): Color {
    return consColor(...getRGB(c1).map((c, i) => c + getRGB(c2)[i]));
}

// Substract two colors
export function subColor(c1: Color, c2: Color): Color {
    return consColor(...getRGB(c1).map((c, i) => c - getRGB(c2)[i]));
}

// Multiply two colors
export function mulColor(c1: Color, c2: Color): Color {
    return consColor(...getRGB(c1).map((c, i) => c * getRGB(c2)[i] / 255));
}

// Divide two colors
export function divColor(c1: Color, c2: Color): Color {
    return consColor(...getRGB(c1).map((c, i) => c / getRGB(c2)[i]));
}

// Do the average of two colors
export function meanColor(c1: Color, c2: Color): Color {
    return consColor(...getRGB(c1).map((c, i) => (c + getRGB(c2)[i]) / 2));
}

export function mergeColor(c1: Color, c2: Color): Color {
    return consColor(
        Math.max(getRed(c1), getRed(c2)),
        Math.max(getGreen(c1), getGreen(c2)),
        Math.max(getBlue(c1), getBlue(c2))
    );
}

// Do the weighted average of two colors
export function meanColorWeighted(c1: Color, p1: number, c2: Color, p2: number): Color {
    return consColor(...getRGB(c1).map((c, i) => i < 3 ? c * p1 + getRGB(c2)[i] * p2 : c));
}


//// Examples
export const WHITE: Color = consColor(255, 255, 255);
export const BLACK: Color = consColor(0, 0, 0);
export const RED: Color = consColor(255, 0, 0);
export const GREEN: Color = consColor(0, 255, 0);
export const BLUE: Color = consColor(0, 0, 255);
export const TRANSPARENT: Color = consColor(255, 255, 255, 0);
