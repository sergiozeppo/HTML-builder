const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
const path = require('node:path');

const pathToBundle = path.join(__dirname, 'project-dist');

const pathToTemplate = path.join(__dirname, 'template.html');
const pathToHTML = path.join(pathToBundle, 'index.html');

const pathToFolderAssets = path.join(__dirname, 'assets');
const pathToCopyAssets = path.join(pathToBundle, 'assets');

const pathToFolderStyles = path.join(__dirname, 'styles');
const pathToFileStyle = path.join(pathToBundle, 'style.css');

const pathToFolderComponents = path.join(__dirname, 'components');

async function copyFolder(folder, copiedFolder) {
  try {
    await fsPromises.rm(copiedFolder, { recursive: true, force: true });
    await fsPromises.mkdir(copiedFolder, { recursive: true });
    const files = await fsPromises.readdir(folder, { withFileTypes: true });
    const promises = files.map((file) => {
      const pathToFile = path.join(folder, file.name);
      const pathToCopy = path.join(copiedFolder, file.name);
      if (file.isFile()) {
        fsPromises.copyFile(pathToFile, pathToCopy);
      } else {
        copyFolder(pathToFile, pathToCopy);
      }
    });
    return await Promise.all(promises);
  } catch (err) {
    return console.log(err);
  }
}

async function bundleMarkup() {
  try {
    const files = await fsPromises.readdir(pathToFolderComponents, {
      withFileTypes: true,
    });
    let str = await fsPromises.readFile(pathToTemplate, {
      encoding: 'utf-8',
    });
    const promises = files.map(async (file) => {
      const componentName = path.parse(file.name).name;
      const componentFile = path.join(pathToFolderComponents, file.name);
      const componentRead = await fsPromises.readFile(componentFile, {
        encoding: 'utf-8',
      });
      str = str.replaceAll(`{{${componentName}}}`, componentRead);
    });
    await Promise.all(promises);
    return await fsPromises.writeFile(pathToHTML, str);
  } catch (err) {
    return console.log(err);
  }
}

function bundleStyles() {
  return fs.readdir(
    pathToFolderStyles,
    { withFileTypes: true },
    (err, files) => {
      if (err) return console.log(err);
      else {
        const writeStream = fs.createWriteStream(pathToFileStyle);
        files.forEach((file) => {
          if (file.isFile()) {
            if (path.parse(file.name).ext === '.css') {
              const pathFile = path.join(pathToFolderStyles, file.name);
              const readStream = fs.createReadStream(pathFile, {
                encoding: 'utf-8',
              });
              readStream.pipe(writeStream);
            }
          }
        });
      }
    },
  );
}

async function createDistFolder() {
  try {
    await fsPromises.rm(pathToBundle, { recursive: true, force: true });
    await fsPromises.mkdir(pathToBundle, { recursive: true });
    copyFolder(pathToFolderAssets, pathToCopyAssets);
    bundleMarkup();
    bundleStyles();
  } catch (err) {
    return console.log(err);
  }
}

createDistFolder();
