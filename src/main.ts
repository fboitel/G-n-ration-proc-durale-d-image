import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { toRaster } from './image';
import { limitedByFrequencyWhiteNoise, whiteNoise } from './generators/noise'

// TEST

const width = 500;
const height = 500;
const img = limitedByFrequencyWhiteNoise(width, height, 20)

// OUTPUT

const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');
context.putImageData(toRaster(img), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
