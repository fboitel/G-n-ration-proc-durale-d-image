import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from './image';
import { whiteNoise } from './generators/noise'

// TEST

const img = whiteNoise()

// OUTPUT

const size = 500;
const canvas = createCanvas(size, size);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img, size), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
