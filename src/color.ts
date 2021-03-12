import { maxHeaderSize } from "http";

export type Color = number[];

export const WHITE:       Color = [255, 255, 255, 255];
export const BLACK:       Color = [  0,   0,   0, 255];
export const RED:         Color = [255,   0,   0, 255];
export const GREEN:       Color = [  0, 255,   0, 255];
export const BLUE:        Color = [  0,   0, 255, 255];
export const TRANSPARENT: Color = [255, 255, 255,   0];

export function mixColor(c1: Color, c2: Color): Color {
	return c1.map( (c,i) => (c + c2[i])/2 );
}