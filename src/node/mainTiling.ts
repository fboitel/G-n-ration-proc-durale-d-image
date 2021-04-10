import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from '../common/image';
import { generators } from '../common/generators/generator'
import { pavageCarreGen, pavageHexaGen, pavageTriangleGen, pavageCarreAdouciGen, pavageGrandRhombitrihexagonalGen, translate, rotate, pavagePentagonalGen } from '../common/generators/tiling';
import { consColor } from '../common/color'

// TEST

const width = 1000;
const height = 1000;
const rep = 10;

//const img = rotate(Math.PI/3, pavageCarreGen());
//const img = rotate(Math.PI/4, pavageCarreGen());
//const img = rotate(Math.PI/3, translate(50, 50, pavageGrandRhombitrihexagonalGen(1000, 1000, 20)));
const img = pavagePentagonalGen([[100, 100], [50, 500], [250, 990], [900, 900], [900, 100]]);
// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img, createImageData), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/joliPavage.png', buffer);
