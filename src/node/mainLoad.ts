import { BLACK, BLUE, WHITE } from '../common/color';
import { loadFromFile, saveToPNG } from '../node/file';
import { filtersNew as filters } from '../common/filters/filter';
import { consImage } from '../common/image';

const red = loadFromFile('images/red.png');
const green = loadFromFile('images/green.png');
const blue = loadFromFile('images/blue.png');
const rocket = loadFromFile('images/rocket.png');
const hawkeye = loadFromFile('images/hawkeye.jpg');
const mandrill = loadFromFile('images/mandrill.jpg');
const white = consImage(500, 500, (x, y) => WHITE);
const black = consImage(500, 500, (x, y) => BLACK);

/*
hawkeye.then(img => saveToPNG(filters.gaussianBlur(img), 'gaussblur'));
hawkeye.then(img => saveToPNG(filters.sharpen(img), 'sharpen'));
hawkeye.then(img => saveToPNG(filters.edgeDetection(img), 'detection'));
*/
hawkeye.then(img => saveToPNG(filters.colorimetry.negative(img), 'negate'));
hawkeye.then(img => saveToPNG(filters.composition.multiply(img, white), 'white'));
hawkeye.then(img => saveToPNG(filters.composition.multiply(img, black), 'black'));
Promise.all([red, green, blue]).then((imgs) => saveToPNG(filters.composition.minus(filters.composition.plus(filters.composition.plus(imgs[0], imgs[1]), imgs[2]), imgs[0]), 'add'));
hawkeye.then(img => saveToPNG(filters.colorimetry.opacity(img, -.5), 'opacity'));
mandrill.then(img => saveToPNG(filters.colorimetry.brightness(img, .5), 'brighten'));
