import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from '../common/image';
import { pavageCarreGen, pavageHexaGen, pavageTriangleGen, pavageCarreAdouciGen, pavageGrandRhombitrihexagonalGen, translate, rotate, pavagePenType1Gen } from '../common/generators/tiling';

// TEST

const width = 1000;
const height = 1000;
const rep = 10;

//const img = rotate(Math.PI/3, pavageCarreGen());
//const img = rotate(Math.PI/4, pavageCarreGen());
//const img = rotate(Math.PI/3, translate(50, 50, pavageGrandRhombitrihexagonalGen(1000, 1000, 20)));
const img = pavagePenType1Gen(width, height, 150, 130, 100, 60, Math.PI/2, Math.PI*(3/4), 2);
// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img, createImageData), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/joliPavage.png', buffer);
