import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { filters } from './filter';
import { toRaster } from './image';
import { voronoi } from './generators/distance'

// TEST

const src = voronoi()
const out = filters.darken(src)

// OUTPUT

const size = 500;
const canvas = createCanvas(size, size);
const context = canvas.getContext('2d');
context.putImageData(toRaster(out, size), 0, 0);
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/test.png', buffer);
