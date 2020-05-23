const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const util = require('./util');

let env = process.env;
console.log(`env: ${env}`);

let dist = util.getDist(env.NODE_ENV);
console.log(`dist: ${dist}`);

let isDev = env.NODE_ENV === 'development';
console.log(`isDevelopment: ${isDev}`);

module.exports = {

    entry: './src/index',
    output: {
        filename: isDev ? 'js/[name].[hash].js' : 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, '../' + dist),
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: isDev ? [] : ["transform-remove-console"]
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isDev ? 'vue-style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                            publicPath: '../',
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: isDev ? '[name].[ext]' : '[contenthash].[ext]',
                    outputPath: 'img',
                },
            },
            {
                test: /\.(woff|woff2|eof|ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: isDev ? '[name].[ext]' : '[contenthash].[ext]',
                    outputPath: 'font',
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({}),
        new ManifestPlugin(),
        new VueLoaderPlugin(),
    ]
};
