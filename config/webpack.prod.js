const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    output: { filename: '[name].[contenthash].js'},
    module: { 
        rules: [
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
        ], 
    },
    optimization: {
        minimize: true,
        minimizer: ['...', new CssMinimizerPlugin()],
    },
});