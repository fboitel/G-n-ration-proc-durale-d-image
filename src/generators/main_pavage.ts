import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from '../image';
import { generators } from './generator'
import { pavageCarréGen, pavageHexaGen, pavageTriangleGen } from './pavage';
import { color } from '../color'

// TEST

const width = 500;
const height = 500;
const rep = 5;

//const img = pavageHexaGen(width, height, size, color(122, 122, 255, 255), color(255, 0, 0, 255), color(0, 255, 0, 255));
//const img = pavageCarréGen(width, height, size, color(122, 122, 255, 255), color(255, 0, 0, 255));
const img = pavageTriangleGen(width, height, rep, color(122, 122, 5, 255), color(255, 255, 0, 255));

// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/joliPavage.png', buffer);
