const pageConfig = require('./page.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const colors = require('colors');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const path = require('path');
const config = require("./config/config.js");
const jsInlineMode = process.env.MODE ? (config.INLINE == process.env.MODE || config.INLINEJS == process.env.MODE) : undefined
const cssInlineMode = process.env.MODE ? (config.INLINE == process.env.MODE || config.INLINECSS == process.env.MODE) : undefined


// 当配置optimization选项后，html-webpack-plugin在多页面的情况下不能正确的将分割的包引入，所以需要这个plugin来支持
class ChunksFromEntryPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('ChunksFromEntryPlugin', compilation => {
            compilation.hooks.htmlWebpackPluginAlterChunks.tap(
                'ChunksFromEntryPlugin',
                (_, { plugin }) => {
                    // takes entry name passed via HTMLWebpackPlugin's options
                    // 获取
                    const entry = plugin.options.chunks;

                    // 获取所有入口
                    let entrypoint = []
                    let name = new Set()
                    entry.forEach(e => {
                        compilation.entrypoints.get(e).chunks.forEach(chunk => {
                            // 如果已经添加过这个chunk了，就不再添加了
                            if (!name.has(chunk.name)) {
                                name.add(chunk.name)
                                entrypoint.push(chunk)
                            }
                        });
                    })
                    console.log('=================START==================='.rainbow)
                    console.log('|'.red)
                    console.log('当前入口chunks关联chunks数量'.rainbow.bold, `：${entrypoint.length}`.red.bold);
                    console.log('|'.red)
                    console.log('=================END===================='.rainbow)
                    return entrypoint.map(chunk =>
                        ({
                            names: chunk.name ? [chunk.name] : [],
                            files: chunk.files.slice(),
                            size: chunk.modulesSize(),
                            hash: chunk.hash
                        })
                    );
                }
            );
        });
    }
}
exports.pushHtmlWebpackPlugins = (webpackConfig, options = {}) => {
    if (pageConfig && Array.isArray(pageConfig)) {
        pageConfig.map(page => {
            // 路径是相对与当前文件的
            webpackConfig.entry[page.name] = `./src/pages/${page.jsEntry}`;
            let template = path.join(__dirname, `./src/pages/${page.html}`);
            // 如果是ejs文件，启用ejs-loader编译
            if (path.extname(page.html) === '.ejs') {
                template = `!!ejs-loader!${template}`;
            }
            let str = ''
            let mode = ''
                // 为了初始更快，把setSize放到html 里
            if (cssInlineMode && jsInlineMode) {
                str = '.(css|js)'
                mode = 'inline'
            } else if (jsInlineMode) {
                str = '.(js)'
                mode = 'jsinline'
            } else if (cssInlineMode) {
                str = '(.css|setSize.js)$'
                mode = 'cssinline'
            } else {
                str = 'setSize(.*).(js)'
                mode = 'default'
            }
            console.log('打包模式'.rainbow.bold, mode.green)
            webpackConfig.plugins.push(new ChunksFromEntryPlugin())
            webpackConfig.plugins.push(new HtmlWebpackPlugin({
                // 输出文件路径和名称
                filename: path.join(__dirname, `/dist/${page.name}.html`),
                // html模板所在的文件路径
                template,
                // script标签位于html文件的 body 底部
                inject: true,
                // chunks主要用于多入口文件，当你有多个入口文件，那就回编译后生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件
                chunks: ['setSize', page.name],
                // 将代码打包到html中
                inlineSource: str,
                // inlineSource: str,
                // chunk加载顺序
                chunksSortMode: 'dependency',
                ...options
            }))
            webpackConfig.plugins.push(new HtmlWebpackInlineSourcePlugin())
        })
    }
    return webpackConfig
}
