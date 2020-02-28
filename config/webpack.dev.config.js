const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge');
const webpack = require('webpack')
const utils = require('../utils');
const path = require('path');


module.exports = utils.pushHtmlWebpackPlugins(
    merge(baseConfig, {
        mode: 'development',
        devtool: '#cheap-module-eval-source-map',
        // 起本地服务
        devServer: {
            // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
            contentBase: '../dist/',
            historyApiFallback: true,
            inline: true,
            // 终端不显示打包信息 console
            clientLogLevel: "none",
            hot: true,
            host: '0.0.0.0',
            port: 9000,
            before(_, server) {
                console.log(path.join(__dirname, '../src/pages'))
                server._watch(path.join(__dirname, '../src/pages'))
            },
        },
        module: {
            rules: [{
                test: /\.(le|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
                include: path.join(__dirname, '../src/'),
            }]
        },
        plugins: [
            /*热更新*/
            new webpack.HotModuleReplacementPlugin(),
        ],
    }));
