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
        // host: util.getLocalIP(),
        host: '192.168.0.138',
        port: 8083,
        hot: true,
        writeToDisk: true,
        disableHostCheck: true
    },
    plugins: [
        new webpack.DefinePlugin({
            "NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "BASE_URL": JSON.stringify(util.dev.origin)
        }),
    ]
});
