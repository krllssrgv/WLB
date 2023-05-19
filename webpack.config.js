'use strict';

let path = require('path');

module.exports = {
  mode: 'development',
  entry: '/src/js/index.js',
  output: {
    filename: 'main.js',
    path: __dirname + '/src/js'
  },
  watch: true,

  module: {}
};
