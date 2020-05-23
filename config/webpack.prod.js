const merge = require('webpack-merge');
const webpack = require('webpack');

const util = require('./util');
const deploy = require('./deploy');

module.exports = merge(deploy, {
    plugins: [
        new webpack.DefinePlugin({
            "BASE_URL": JSON.stringify(util.build.origin)
        }),
    ]
});
