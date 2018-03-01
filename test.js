//压缩html
var fs = require('fs');
var minify = require('html-minifier').minify;
fs.readFile('./dist/src/index/index.html', 'utf8', function (err, data) {
  if (err) {
    throw err;
  }
  fs.writeFile('./dist/src/index/index.html', minify(data,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true}), function() {
    console.log('success/index.html');
  });
});

fs.readFile('./dist/src/detail/detail.html', 'utf8', function (err, data) {
  if (err) {
    throw err;
  }
  fs.writeFile('./dist/src/detail/detail.html', minify(data,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true}), function() {
    console.log('success/detail.html');
  });
});

fs.readFile('./dist/src/404/404.html', 'utf8', function (err, data) {
  if (err) {
    throw err;
  }
  fs.writeFile('./dist/src/404/404.html', minify(data,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true}), function() {
    console.log('success/404.html');
  });
});

