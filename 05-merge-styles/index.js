const fs = require('node:fs');
const path = require('node:path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist');
const bundle = path.join(pathToBundle, 'bundle.css');

fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
  if (err) return console.log(err);
  else {
    const writeStream = fs.createWriteStream(bundle);
    files.forEach((file) => {
      if (file.isFile()) {
        if (path.parse(file.name).ext === '.css') {
          const pathFile = path.join(pathToStyles, file.name);
          const readStream = fs.createReadStream(pathFile, {
            encoding: 'utf-8',
          });
          readStream.pipe(writeStream);
        }
      }
    });
  }
});
