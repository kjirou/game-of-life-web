const autoprefixer = require('autoprefixer');
const ejs = require('ejs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const {
  CLIENT_DIST_ROOT,
  CLIENT_MOCK_SERVER_ROOT,
  CLIENT_SRC_ROOT,
  RAILS_APP_ASSETS_ROOT,
  sharedWebpackConfig,
} = require('./shared');


module.exports = {
  mode: 'development',
  entry: {
    'bundle': path.join(CLIENT_SRC_ROOT, 'index.js'),
  },
  output: {
    filename: '[name].js',
    path: CLIENT_DIST_ROOT,
  },
  devtool: 'source-map',
  module: {
    rules: sharedWebpackConfig.module.rules,
  },
  resolve: {
    extensions: sharedWebpackConfig.resolve.extensions,
  },
  devServer: {
    // 静的なファイル群を配布する際のドキュメントルート
    contentBase: [
      // Rails の assets ディレクトリを指定している。
      //
      // しかし、本来の使い方である静的なファイルを直接取得するためではなく、
      // watchContentBase と併用して app/assets/stylesheets/ 以下の .scss ファイルの変更時に自動でリロードするため。
      //
      // なおこの設定の副作用で、以下の害が出ている。
      // 1) 開発サーバでは /html, /images, /javascripts, /stylesheets のパスが予約されている
      // 2) かつ、Sprockets 用のソースコードに URL アクセスできる
      RAILS_APP_ASSETS_ROOT,
    ],

    watchContentBase: true,

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
          path.join(CLIENT_MOCK_SERVER_ROOT, 'templates/index.html'),
          genereateCommonTemplateVariables(req)
        );
      });

      app.get('/*.html', (req, res) => {
        res.render(
          path.join(CLIENT_MOCK_SERVER_ROOT, 'templates', req.path),
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
    new ExtractTextPlugin("bundle.css"),
  ]
};
