const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common.js');
const util = require('./util');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './' + util.dev.dist,
        open: true,
        openPage: '#/',
        hot: true,
        writeToDisk: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            "BASE_URL": JSON.stringify(util.dev.origin)
        }),
    ]
});
