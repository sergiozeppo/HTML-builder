const fs = require('node:fs');
const path = require('node:path');

const secretPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(secretPath, file.name);
      const fileExt = path.extname(filePath).slice(1);
      const fileName = path.basename(filePath).replace(`.${fileExt}`, '');
      fs.stat(filePath, (err, stats) => {
        if (err) console.log(err);
        console.log(
          `${fileName} - ${fileExt} - ${(stats.size / 1024).toFixed(3)}Kb`,
        );
      });
    }
  });
});
