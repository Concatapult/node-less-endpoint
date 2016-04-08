var LESS = require('less');
var fs = require('fs');
var path = require('path');
var nodeEnv = process.env.NODE_ENV || 'development';

if (! Object.assign) {
  console.error("\n----\n");
  console.error("! Object.assign is not defined");
  console.error("  Please install node v4.0.0+ or npm install es6-object-assign");
  console.error("\n----\n");
}

exports.serve = function (filePath, options) {

  options = options || {};

  if ( ! fs.existsSync(filePath) ) {
    throw Error('[node-less-endpoint] File does not exist: ' + filePath);
  }

  options.watchDir = options.watchDir || path.dirname(filePath);

  options.includePaths = options.includePaths || [path.dirname(filePath)];
  options.includePaths.push( path.join(process.cwd(), 'node_modules') );

  var cache = null;

  var lessOptions = {
    filename: filePath,
    paths: options.includePaths,
    outputStyle: options.outputStyle || 'nested'
  };

  if (nodeEnv === 'development') {

    fs.watch(options.watchDir, { recursive: true }, function(e, file) {
      if (! isLessFile(file) ) return;

      if (options.debug) {
        console.log("[node-less-endpoint] Clearing cache for:", path.basename(filePath));
      }
      cache = null;
    });
  }
  else if (nodeEnv === 'production') {
    Object.assign(lessOptions, {
      compress: true
    })
  }


  return function (req, res) {

    res.set('Content-Type', 'text/css');

    if (cache) {
      return res.send(cache);
    }

    // LESS.render only renders a string; we must read target file first
    fs.readFile(filePath, 'utf8', function (err, fileContents) {
      if (err) {
        res.status(500).send(err);
        throw err;
      }

      LESS.render( fileContents, Object.assign({}, lessOptions), function(error, result) {
        if (error) {
          console.log("\n----------------------------\n");
          console.log("LESS ERROR:", error.message);
          console.log("\tin file", error.file);
          console.log("\ton line", error.line, "col", error.column);
          console.log("\n----------------------------\n");
          return res.status(500).send(error);
        }

        cache = result.css;
        res.send(result.css);
      });
    })
  }

}

var ext = /\.less$/;
function isLessFile (file) {
  return file.match(ext);
}
