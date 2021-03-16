import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from './image';
import { limitedByFrequencyWhiteNoise, perlinNoise, whiteNoise } from './generators/noise'

// TEST

const width = 1000;
const height = 1000;
const img = perlinNoise(width, height, 150)

// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
