var convert = require('color-convert');

function compute_hsl(base, x, y){
    let lhsl = (x/2) * (2 - (y/100));
    let shsl = (x * y) / (lhsl < 50 ? lhsl * 2 : 200 - lhsl * 2);
    let color = convert.hsl.rgb(base, shsl, lhsl)
    return convert.rgb.hex(color);  
}

let baseColor = 216.48;

let settings = {
    home_page: 'http://localhost:3000',
    smtp_host: 'smtp.gmail.com',
    email: 'sitedeveloptest@gmail.com',
    pass: 'tester13579',
    name: 'Kord Industries',
    firstColor: compute_hsl(baseColor, 100, 83.14),
    firstDarkColor: compute_hsl(baseColor, 80, 83.14),
    secondColor: compute_hsl(baseColor + 345, 100, 74.51),
    secondDarkColor: compute_hsl(baseColor+ 350, 80, 74.51),
}

module.exports = settings