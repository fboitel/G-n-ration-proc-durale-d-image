import { createCanvas, createImageData } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from '../common/image';
import { fractalNoise, limitedByFrequencyWhiteNoise, perlinNoise, whiteNoise } from '../common/generators/noise'

// TEST

const width = 1000;
const height = 1000;
const img = fractalNoise(width, height, 2);

// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img, createImageData), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
