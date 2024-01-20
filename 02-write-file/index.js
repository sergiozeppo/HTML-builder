const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { stdin, stdout } = process;

const file = path.join(__dirname, 'new.txt');

stdout.write('Hello, reviewer! Please, enter some text\n');
stdin.on('data', (data) => {
  const inputData = data.toString();
  if (inputData.includes('exit')) process.exit();
  fs.writeFile(file, data, { flag: 'a' }, (err) => {
    if (err) return console.log(err);
  });
});

process.on('exit', () =>
  stdout.write('Thank you for entering text. See you later!'),
);
process.on('SIGINT', () => process.exit());
