export type Color = number[];

export function color(r: number, g: number, b: number, a: number): Color {
    return [r, g, b, a];
}

export const WHITE: Color = color(255, 255, 255, 255);
export const BLACK: Color = color(0, 0, 0, 255);
export const RED: Color = color(255, 0, 0, 255);
export const GREEN: Color = color(0, 255, 0, 255);
export const BLUE: Color = color(0, 0, 255, 255);
export const TRANSPARENT: Color = color(255, 255, 255, 0);

export function normalize(color: Color): Color {
    return color.map(c =>
        c < 0 ? 0 :
            c > 255 ? 255 :
                c)
}

export function mean(c1: Color, c2: Color): Color {
    return c1.map((c, i) => (c + c2[i]) / 2);
}

export function plus(c1: Color, c2: Color): Color {
    return normalize(c1.map((c, i) => c + c2[i]));
}

export function minus(c1: Color, c2: Color): Color {
    return normalize(c1.map((c, i) => c - c2[i]));
}

export function multiply(c1: Color, c2: Color): Color {
    return normalize(c1.map((c, i) => c * c2[i]));
}

export function divide(c1: Color, c2: Color): Color {
    return normalize(c1.map((c, i) => c / c2[i]));
}