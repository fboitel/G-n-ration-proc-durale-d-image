import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from '../common/image';
import { generators } from '../common/generators/generator'
import { pavageCarreGen, pavageHexaGen, pavageTriangleGen, pavageCarréAdouciGen, pavageGrandRhombitrihexagonalGen } from '../common/generators/tiling';
import { color } from '../common/color'

// TEST

const width = 1000;
const height = 1000;
const rep = 7;

//const img = pavageHexaGen(width, height, size, color(122, 122, 255, 255), color(255, 0, 0, 255), color(0, 255, 0, 255));
//const img = pavageCarreGen(width, height, size, color(122, 122, 255, 255), color(255, 0, 0, 255));
const img = pavageGrandRhombitrihexagonalGen(width, height, rep, color(255, 0, 0, 255), color(0, 255, 0, 255), color(0, 0, 255, 255));

// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img, createImageData), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/joliPavage.png', buffer);
