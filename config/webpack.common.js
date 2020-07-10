const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');


const util = require('./util');

let NODE_ENV = process.env.NODE_ENV;
console.log(`env: ${NODE_ENV}`);

let dist = util.getDist(NODE_ENV);
console.log(`dist: ${dist}`);

let isDev = NODE_ENV === 'development';
console.log(`isDevelopment: ${isDev}`);

module.exports = {

    entry: './src/main',
    output: {
        filename: isDev ? 'js/[name].[hash].js' : 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, '../' + dist),
        publicPath: './'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.ts', 'tsx'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('src'),
            'swiper$': 'swiper/js/swiper.min'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
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
                    esModule: false,
                    limit: 8192,
                    name: isDev ? '[name].[ext]' : '[contenthash].[ext]',
                    outputPath: 'img',
                },
            },
            {
                test: /\.(woff|woff2|eof|ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 8192,
                    name: isDev ? '[name].[ext]' : '[contenthash].[ext]',
                    outputPath: 'font',
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin([ dist ], {
            root: path.resolve(__dirname, '../'),
            exclude: []
        }),
        new CopyPlugin({
           patterns: [{
               from: 'favicon.ico',
               to: path.resolve(__dirname, '../' + dist),
           }]
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
           /* favicon: path.resolve('favicon.ico')*/
        }),
        new ManifestPlugin(),
        new VueLoaderPlugin(),
    ]
};
