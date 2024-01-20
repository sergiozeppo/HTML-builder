const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(file, { encoding: 'utf-8' });

readStream.on('data', (chunk) => console.log(chunk));
