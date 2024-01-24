const fs = require('node:fs');
const path = require('node:path');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopiedFolder = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.mkdir(pathToCopiedFolder, { recursive: true, force: true }, (err) => {
    if (err) {
      return console.log(err);
    }
  });
  fs.readdir(pathToCopiedFolder, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        const pathToFile = path.join(pathToCopiedFolder, file);
        fs.unlink(pathToFile, (err) => {
          if (err) {
            return console.log(err);
          }
        });
      });
    }
  });
  fs.readdir(pathToFolder, (err, files) => {
    if (err) {
      return console.log(err);
    } else {
      files.forEach((file) => {
        const pathToFile = path.join(pathToFolder, file);
        const copyFilePath = `${pathToCopiedFolder}/${file}`;
        fs.copyFile(pathToFile, copyFilePath, (err) => {
          if (err) {
            return console.log(err);
          }
        });
      });
    }
  });
}
copyDir();
