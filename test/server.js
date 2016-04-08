var lessEndpoint = require('../index.js');

var app = require('express')();

app.get('/assets/app-bundle.css',
  lessEndpoint.serve('./test/styles/index.less', {
    debug: true
  }));

module.exports = app;
