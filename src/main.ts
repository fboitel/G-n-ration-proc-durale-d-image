import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from './image';
import { fractalNoise, limitedByFrequencyWhiteNoise, perlinNoise, whiteNoise } from './generators/noise'

// TEST

const width = 1000;
const height = 1000;
const img = fractalNoise(width, height, 2)

// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
