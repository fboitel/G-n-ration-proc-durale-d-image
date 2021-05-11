export type Color = number[];

export const R = 0;
export const G = 1;
export const B = 2;
export const A = 3;

// Create a color
export function consColor(r: number, g: number, b: number, a: number = 255): Color {
    return [r, g, b, a].map(c => Math.max(0, Math.min(255, c)));
}

export function colorToHex(color: Color): string {
    return '#' + (color[A] === 255 ? getRGB(color) : color).map(c => {
        let str = c.toString(16);
        if (str.length === 1) {
            str = '0' + str;
        }
        return str;
    }).join('');
}

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

export function mapColor(color: Color, mapper: (channel: number, index: number) => number): Color {
    return consColor(mapper(color[R], R), mapper(color[G], G), mapper(color[B], B), color[A]);
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
    return mapColor(color, c => c ^ 255);
}

//// Operations

// Add two colors
export function addColor(color1: Color, color2: Color): Color {
    return mapColor(color1, (c, i) => c + color2[i]);
}

// Subtract two colors
export function subColor(color1: Color, color2: Color): Color {
    return mapColor(color1, (c, i) => c - color2[i]);
}

// Multiply two colors
export function mulColor(color1: Color, color2: Color): Color {
    return mapColor(color1, (c, i) => c * color2[i] / 255);
}

// Divide two colors
export function divColor(color1: Color, color2: Color): Color {
    return mapColor(color1, (c, i) => c / color2[i]);
}

// Do the average of two colors
export function meanColor(color1: Color, color2: Color): Color {
    return mapColor(color1, (c, i) => (c + color2[i]) / 2);
}

export function mergeColor(color1: Color, color2: Color): Color {
    return mapColor(color1, (c, i) => Math.max(c, color2[i]));
}

// Do the weighted average of two colors
export function meanColorWeighted(color1: Color, p1: number, color2: Color, p2: number): Color {
    return mapColor(color1, (c, i) => c * p1 + color2[i] * p2);
}


//// Examples
export const WHITE: Color = consColor(255, 255, 255);
export const BLACK: Color = consColor(0, 0, 0);
export const RED: Color = consColor(255, 0, 0);
export const GREEN: Color = consColor(0, 255, 0);
export const BLUE: Color = consColor(0, 0, 255);
export const TRANSPARENT: Color = consColor(255, 255, 255, 0);
