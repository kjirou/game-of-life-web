const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const {
  DOCS_ROOT,
  SRC_ROOT,
  sharedWebpackConfig,
} = require('./shared');


module.exports = {
  mode: 'production',
  entry: {
    'bundle': path.join(SRC_ROOT, 'index.js'),
  },
  output: {
    filename: '[name].js',
    path: DOCS_ROOT,
  },
  module: {
    rules: sharedWebpackConfig.module.rules,
  },
  resolve: {
    extensions: sharedWebpackConfig.resolve.extensions,
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __TEST__: false,
    }),
    new ExtractTextPlugin('bundle.css'),
  ]
};
