import { GREEN, WHITE } from "./color";
import { displayImage, Image } from "./image";
import { filters } from "./filter"

import { createCanvas, createImageData } from 'canvas';
const fs = require('fs');

let w = 100;
let h = 100;

let images = (x: number, y:number) => WHITE;

//images = filters.damier(images);

let canvas = createCanvas(w, h);
let context = canvas.getContext('2d');

displayImage(filters.darken(images), context);

let buffer = canvas.toBuffer('image/png');
fs.writeFileSync('test.png', buffer);

