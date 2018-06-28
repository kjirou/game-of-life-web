const autoprefixer = require('autoprefixer');
const ejs = require('ejs');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');


const RAILS_PUBLIC_CLIENT_DIST_RELATIVE_PATH = 'public/client/dist';

const PROJECT_ROOT = path.join(__dirname, '../..');
const CLIENT_ROOT = path.join(PROJECT_ROOT, 'client');
const CLIENT_DIST_ROOT = path.join(CLIENT_ROOT, 'dist');
const CLIENT_MOCK_SERVER_ROOT = path.join(CLIENT_ROOT, 'mock-server');
const CLIENT_SRC_ROOT = path.join(CLIENT_ROOT, 'src');
const RAILS_APP_ASSETS_ROOT = path.join(PROJECT_ROOT, 'app/assets');
const RAILS_PUBLIC_CLIENT_DIST_ROOT = path.join(PROJECT_ROOT, RAILS_PUBLIC_CLIENT_DIST_RELATIVE_PATH);

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
  CLIENT_DIST_ROOT,
  CLIENT_MOCK_SERVER_ROOT,
  CLIENT_SRC_ROOT,
  PROJECT_ROOT,
  RAILS_APP_ASSETS_ROOT,
  RAILS_PUBLIC_CLIENT_DIST_RELATIVE_PATH,
  RAILS_PUBLIC_CLIENT_DIST_ROOT,
  sharedWebpackConfig,
};
