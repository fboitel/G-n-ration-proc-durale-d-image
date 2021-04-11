import { loadFromFile, saveToPNG } from '../common/file';
import { filters } from '../common/filters/filter';

const red = loadFromFile('images/red.png');
const green = loadFromFile('images/green.png');
const blue = loadFromFile('images/blue.png');
const flower = loadFromFile('images/flower.jpg');
const rocket = loadFromFile('images/rocket.png');
const hawkeye = loadFromFile('images/hawkeye.jpg');
const moon = loadFromFile('images/moon.png');
const label = loadFromFile('images/label.gif');
const flow = loadFromFile('images/f2.png');

/*
Promise.all([label, flow]).then((imgs) => saveToPNG(filters.composeMultiply(imgs[0], imgs[1]), 'mul'));

moon.then(img => saveToPNG(filters.composeMultiply(img, img), 'mul'));

rocket.then(img => saveToPNG(filters.composeMerge(filters.blue(img), filters.red(img)), 'purple'));
hawkeye.then(img => saveToPNG(filters.brighten(img), 'brighten'));

Promise.all([red, green, blue]).then((imgs) => saveToPNG(
    filters.composeMinus(
        filters.composePlus(
            filters.composePlus(imgs[0], imgs[1]), imgs[2]), imgs[0])
    , 'merge'));
flower.then(img => saveToPNG(filters.blur(img), 'flower'));
*/
hawkeye.then(img => saveToPNG(filters.gaussianBlur(img), 'gaussblur'));
hawkeye.then(img => saveToPNG(filters.sharpen(img), 'sharpen'));
hawkeye.then(img => saveToPNG(filters.edgeDetection(img), 'detection'));
