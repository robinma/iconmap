/**
 * 
 */

const AllFiles = require('./src/getallfiles.js');
const DrawIcons = require('./src/drawIcons');

AllFiles('../麻点样式图标', (over) => {
    drawIcon(over);
});

function drawIcon(files) {
    new DrawIcons(files);
}

