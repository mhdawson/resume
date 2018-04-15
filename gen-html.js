const remark = require('remark');
const html = require('remark-html');
const fs = require('fs');
const path= require('path');

const HTML_BASE='html';

const fileList = [ 'conferences', 'publications' ];

const reportError = function(err, reject, cont) {
  if (err) {
    reject(err);
  } else {
    cont();
  }
}

// convert list of conferences
async function convertMdToHtml(filename) {
  let promise = new Promise((resolve, reject) => {
    fs.readFile(filename + '.md', (err, data) => {
      reportError(err, reject, () => {
        remark()
          .use(html)
          .process(String(data), function (err, file) {
            reportError(err, reject, ()=> {
              fs.writeFile(path.join(HTML_BASE, filename) + '.html', file, (err) => {
                reportError(err, reject, resolve);
              });
            });
          });
      });
    });
  });
  return promise;
};

async function processFiles() {
  for (var i = 0; i < fileList.length; i++) {
    try {
      await convertMdToHtml(fileList[i]);
    } catch(err) {
      console.log(err);
    }
  }
};

processFiles();
