const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin')


module.exports = env => {
    console.log(env)
    return {
        //mode: 'development',
        mode: 'production',
        entry: {
            main: './src/index.js',
            //another: './src/another-module.js'
        },
        //devtool: 'inline-source-map',
        // devServer: {
        //     contentBase: './dist',
        //     hot: true
        // },
        output: {
            //filename: '[name].[contenthash].js',
           /* filename: '[name].[hash].js',*/
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        optimization: {
            //moduleIds: 'hashed', //修復vendor哈希
            //runtimeChunk: 'single',
            //splitChunks: {
                // cacheGroups: {
                //     vendor: {
                //         test: /[\\/]node_modules[\\/]/,
                //         name: 'vendors',
                //         chunks: 'all'
                //     }
                // }
                //chunks: 'all'
            //},
            //usedExports: true
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader'
                    ]
                },
                {
                    test: /\.(woff|woff2|eof|ttf|otf)$/,
                    use: [
                        'file-loader'
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({}),
            new ManifestPlugin()
        ]
    }
};
