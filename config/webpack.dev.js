const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    historyApiFallback: true,
    port: 3000,
    open: true,
    proxy: [
      {
        context: ['/itunes'],
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        pathRewrite: { '^/itunes': '' },
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});