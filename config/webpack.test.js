const merge = require('webpack-merge');
const webpack = require('webpack');

const util = require('./util');
const deploy = require('./deploy');

module.exports = merge(deploy, {
    plugins: [
        new webpack.DefinePlugin({
            "NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "BASE_URL": JSON.stringify(util.test.origin)
        }),
    ]
});
