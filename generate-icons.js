const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const source = 'favicon.svg';

if (!fs.existsSync('icons')){
  fs.mkdirSync('icons');
}

sizes.forEach(size => {
  sharp(source)
    .resize(size, size)
    .toFile(`icons/icon-${size}x${size}.png`)
    .then(info => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
});