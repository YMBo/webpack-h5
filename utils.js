const pageConfig = require('./page.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const path = require('path');

exports.pushHtmlWebpackPlugins = (webpackConfig, options = {}) => {
    if (pageConfig && Array.isArray(pageConfig)) {
        pageConfig.map(page => {
            // 路径是相对与当前文件的
            webpackConfig.entry[page.name] = `./src/pages/${page.jsEntry}`;
            let template =path.join(__dirname, `./src/pages/${page.html}`);
            // 如果是ejs文件，启用ejs-loader编译
            if (path.extname(page.html) === '.ejs') {
                template = `!!ejs-loader!${template}`;
            }
            webpackConfig.plugins.push(new HtmlWebpackPlugin({
                // 输出文件路径和名称
                filename: path.join(__dirname, `/dist/${page.name}.html`),
                // html模板所在的文件路径
                template,
                // script标签位于html文件的 body 底部
                inject: true,
                // chunks主要用于多入口文件，当你有多个入口文件，那就回编译后生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件
                chunks: ['setSize',page.name],
                // 将代码打包到html中
                // inlineSource: 'setSize.js',
                inlineSource: 'setSize(.*).(js)',
                // chunk加载顺序
                chunksSortMode: 'dependency',
                ...options
            }))
            webpackConfig.plugins.push(new HtmlWebpackInlineSourcePlugin())
        })
    }
    return webpackConfig
}
