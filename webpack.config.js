const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const DEVELOPMENT = 'development';
const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'canvas.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'stage-3']
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.jpg$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    },
    plugins: NODE_ENV === DEVELOPMENT ? [
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new ExtractTextPlugin('styles.css'),
    ] : [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: true
            },
            mangle: {
                except: ['$'],
                screw_ie8 : true,
                keep_fnames: true
            },
            sourceMap: false
        }),
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new ExtractTextPlugin('styles.css'),
    ]
};