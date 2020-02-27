const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path')
const webpackBaseConfig = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const utils = require('../utils');
const extractCSS = new ExtractTextPlugin('static/css/[name].[hash:7].css');
const extractLESS = new ExtractTextPlugin('static/css/[name].[hash:7].css');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let prodWebpackConfig = {
    stats: {
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    },
    mode: 'production',
    devtool: 'source-map',
    // 静态资源引入路径前缀信息
    output: {
        publicPath: '',
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            parallel: true,
        }),
        extractCSS,
        extractLESS,
        // 压缩css，解决ExtractTextPlugin重复打包的问题
        new OptimizeCssAssetsPlugin(),
        new BundleAnalyzerPlugin({
            analyzerPort: 9090,
            analyzerHost: '0.0.0.0'
        }),
        // 也不知到为啥里面写了配置就不起作用
        // new OptimizeCssAssetsPlugin({
        //     // 压缩后的名称
        //     assetNameRegExp: /\.min\.css$/g,
        //     // 使用的压缩器
        //     cssProcessor: require('cssnano'),
        //     // 传递给cssnano的options
        //     cssProcessorPluginOptions: {
        //         // 删除规则，选择器和声明中及其周围的注释。请注意，!默认情况下会保留所有带有标记的特殊注释。
        //       preset: ['default', { discardComments: { removeAll: true } }],
        //     },
        //     // 打印信息
        //     canPrint: true
        //   })
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: extractCSS.extract(['css-loader', 'postcss-loader']),
                include: path.join(__dirname, '../src/'),
            },
            {
                test: /\.less$/,
                use: extractLESS.extract(['css-loader', 'postcss-loader', 'less-loader']),
                include: path.join(__dirname, '../src/'),
            }
        ]
    },
    optimization: {
        /*
    上面提到 chunkFilename 指定了 chunk 打包输出的名字，那么文件名存在哪里了呢？
    它就存在引用它的文件中。这意味着一个 chunk 文件名发生改变，会导致引用这个 chunk 文件也发生改变。

    runtimeChunk 设置为 true, webpack 就会把 chunk 文件名全部存到一个单独的 chunk 中，
    这样更新一个文件只会影响到它所在的 chunk 和 runtimeChunk，避免了引用这个 chunk 的文件也发生改变。
    */
        runtimeChunk: {
            name: 'manifest'
                /* 管理被分出来的包，runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单，
                          模块信息清单在每次有模块变更(hash 变更)时都会变更 */
        },
        splitChunks: {
            cacheGroups: {
                //提取项目公共组件
                common: {
                    name: 'common',
                    chunks: 'all', //表示显示块的范围，三个可选值：initial(初始块)、async(按需加载块)、all(默认，全部块)
                    minChunks: 2, //表示分离前被引用次数,默认为1,引用2次以上就分离
                    maxInitialRequests: 3, //最大初始化加载次数，一个入口文件可以并行加载的最大文件数量，默认1
                    minSize: 0 //表示在分离前的最小模块大小，默认为0，最小为30000
                },
                //优先第三方组件
                vendors: { //拆分第三方库（通过npm|yarn安装的库）
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',
                    priority: 10
                },
            }
        }
    },
}

prodWebpackConfig = utils.pushHtmlWebpackPlugins(
    merge(webpackBaseConfig, prodWebpackConfig), {
        // html-webpack-plugin options
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
        }
    })


module.exports = prodWebpackConfig
