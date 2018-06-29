const autoprefixer = require('autoprefixer');
const ejs = require('ejs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const {
  DIST_ROOT,
  MOCK_SERVER_ROOT,
  SRC_ROOT,
  sharedWebpackConfig,
} = require('./shared');


module.exports = {
  mode: 'development',
  entry: {
    'bundle': path.join(SRC_ROOT, 'index.js'),
  },
  output: {
    filename: '[name].js',
    path: DIST_ROOT,
  },
  devtool: 'source-map',
  module: {
    rules: sharedWebpackConfig.module.rules,
  },
  resolve: {
    extensions: sharedWebpackConfig.resolve.extensions,
  },
  devServer: {
    // webpack によりバンドルされたファイル群の URL プレフィックス
    // 最終的な URL は、"{publicPath}/{entryのname}.{拡張子}" になる
    // デフォルト値は "/"
    //publicPath: '/',

    // gzip 圧縮転送への対応可否
    compress: true,

    port: 9000,

    before(app) {
      const genereateCommonTemplateVariables = (req) => {
        return {
          railsAssetURL: 'http://' + req.hostname + ':4434/assets',
        };
      };

      app.engine('html', ejs.renderFile);

      app.get('/', (req, res) => {
        res.render(
          path.join(MOCK_SERVER_ROOT, 'templates/index.html'),
          genereateCommonTemplateVariables(req)
        );
      });

      app.get('/*.html', (req, res) => {
        res.render(
          path.join(MOCK_SERVER_ROOT, 'templates', req.path),
          genereateCommonTemplateVariables(req)
        );
      });
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __REACT_DEVTOOLS_GLOBAL_HOOK__: '({isDisabled: true})',
      __TEST__: false,
    }),
    new ExtractTextPlugin('bundle.css'),
  ]
};
