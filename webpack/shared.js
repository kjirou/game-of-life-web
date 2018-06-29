const autoprefixer = require('autoprefixer');
const ejs = require('ejs');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');


const PROJECT_ROOT = path.join(__dirname, '..');
const DIST_ROOT = path.join(PROJECT_ROOT, 'dist');
const DOCS_ROOT = path.join(PROJECT_ROOT, 'docs');
const SRC_ROOT = path.join(PROJECT_ROOT, 'src');
const WEBPACK_ROOT = path.join(PROJECT_ROOT, 'webpack');
const WEBPACK_DEV_SERVER_ROOT = path.join(WEBPACK_ROOT, 'dev-server');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
const browsers = babelrc.presets.find(preset=>preset[0] === 'env')[1].targets.browsers;


const sharedWebpackConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                sourceMap: true,
                localIdentName: '[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: [
                  autoprefixer({browsers: browsers}),
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
              }
            },
          ]
        }),
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        loader: 'url-loader',
        options: {
          name: './assets/[name]-[hash].[ext]',
          limit: 10240,
        }
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.scss'],
  },
};


module.exports = {
  DIST_ROOT,
  DOCS_ROOT,
  PROJECT_ROOT,
  SRC_ROOT,
  WEBPACK_DEV_SERVER_ROOT,
  sharedWebpackConfig,
};
