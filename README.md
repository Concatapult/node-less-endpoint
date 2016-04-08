# node-less-endpoint

Easily serve a [LESS](http://lesscss.org/) file as CSS from an express endpoint. No grunt/gulp, no build files, no required configuration – just pure data.

### Dependencies

- [LESS](https://www.npmjs.com/package/less) (taken care of by npm install)
- ES6 `Object.assign` (either use node v4.0+ or a [polyfill](https://www.npmjs.com/package/es6-object-assign))

### Installation

    $ npm install node-less-endpoint --save

## Usage - Easy Version

Assuming you have the following directory structure:

```
client/
└── app.less

server/
└── index.js

package.json
```

Then you can write the following as your `server/index.js`:

```javascript
// server.js
var LESS = require('node-less-endpoint');
var app  = require('express')();

app.get('/assets/app-bundle.css',
  LESS.serve('./client/app.less'));

console.log("Listening on port 5555...");
app.listen(5555);
```

And run `node server/index.js`.

Now any GET request to `localhost:5555/app.css` will compile and serve the LESS file located at `./client/app.less`. Any `@import` statements within `app.less` will also be included in the final output.

## Advanced Usage

```javascript
app.get(
  '/app.css',
  LESS.serve('./client/app.less', {

    // (dev only) defaults to parent folder of LESS file.
    // Any LESS file changes in this directory will clear the output cache.
    watchDir: './client/',

    // Defaults to parent folder of the LESS file you specify.
    // The node_modules/ is always included.
    includePaths: ['./client/'],

    // Defaults to false
    debug: false
  })
);
```
