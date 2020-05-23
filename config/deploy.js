const merge = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    //devtool: 'source-map',
    optimization: {
        moduleIds: 'hashed', //修復vendor哈希
        runtimeChunk: 'single',
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ],
        minimize: true,
        splitChunks: {
            cacheGroups: {
            //     vendor: {
            //         test: /[\\/]node_modules[\\/]/,
            //         name: 'vendors',
            //         chunks: 'all'
            //     },
            //     styles: {
            //         name: 'styles',
            //         test: /\.css$/,
            //         chunks: 'all',
            //         enforce: true
            //     }
            },
            chunks: 'all'
        },
    },
});
