const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path =require('path')
const webpackBaseConfig = require('./webpack.base.config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const utils = require('../utils');
const extractCSS = new ExtractTextPlugin('static/css/[name].[hash:7].css');
const extractLESS = new ExtractTextPlugin('static/css/[name].[hash:7].css');

class ChunksFromEntryPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('ChunksFromEntryPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginAlterChunks.tap(
        'ChunksFromEntryPlugin',
        (_, { plugin }) => {
          // takes entry name passed via HTMLWebpackPlugin's options
          const entry = plugin.options.entry;
          const entrypoint = compilation.entrypoints.get(entry);

          return entrypoint.chunks.map(chunk =>
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

let prodWebpackConfig = {
  mode: 'production',
  devtool: 'source-map',
  // 静态资源引入路径前缀信息
  output: {
    publicPath: '',
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true
    }),
    extractCSS,
    extractLESS,
    // 压缩css，解决ExtractTextPlugin重复打包的问题
    new OptimizeCssAssetsPlugin()
    // 也不知到位里面写了配置就不起作用
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
  module:{
    rules:[{
        test: /\.css$/,
        use: extractCSS.extract([ 'css-loader' ]),
        include:  path.join(__dirname, '../src/'),
    },
    {
        test: /\.less$/,
        use: extractLESS.extract([ 'css-loader', 'less-loader' ]),
        include:  path.join(__dirname, '../src/'),
    }]
},
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        // default: {
        //     minChunks: 2,
        //     priority: -20,
        //     reuseExistingChunk: true
        // },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
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

prodWebpackConfig.plugins.push(new ChunksFromEntryPlugin())

module.exports = prodWebpackConfig