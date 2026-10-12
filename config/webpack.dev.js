const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: { filename: '[name].js' },
    devServer: {
        historyApiFallback: true,
        port: 3000,
        hot: true,
        open: true,
    },
    optimization: {
        minimize: false,
    },
    module: {
        rules: [{ test: /\.css$/, use: ['style-loader', 'css-loader']}],
    },
});