import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from '../common/image';
import { generators } from '../common/generators/generator'
import { pavageCarreGen, pavageHexaGen, pavageTriangleGen, pavageCarreAdouciGen, pavageGrandRhombitrihexagonalGen, translate, rotate } from '../common/generators/tiling';
import { color } from '../common/color'

// TEST

const width = 1000;
const height = 1000;
const rep = 10;

//const img = rotate(Math.PI/3, pavageCarreGen());
//const img = rotate(Math.PI/4, pavageCarreGen());
const img = rotate(Math.PI/6, translate(50, 50, pavageGrandRhombitrihexagonalGen()));

// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img, createImageData), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/joliPavage.png', buffer);
