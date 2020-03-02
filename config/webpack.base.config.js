const path = require('path');
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        setSize: path.resolve(__dirname, './setSize.js'),
    },
    output: {
        // 将js文件放的位置
        path: path.resolve(__dirname, '../dist/'),
        // 生成的名称
        filename: 'static/js/[name].[hash:7].js',
        // html引入路径前缀信息
        publicPath: '/',
    },
    module: {
        rules: [{
                test: /\.js?$/,
                include: [path.join(__dirname, '../src'), path.join(__dirname, './')],
                exclude: path.join(__dirname, '../node_modules/'),
                loader: "babel-loader",
                options: {
                    plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-transform-async-to-generator"],
                    presets: ["@babel/preset-env"]
                },
            },
            // html中的img标签
            {
                test: /\.(html)$/i,
                loader: 'html-withimg-loader?min=false',
                include: [path.join(__dirname, '../src')],

                // 不能加下面这个options ， html-webpack-plugin会报错
                // options: {
                //     esModule: false,
                //     deep:true,
                // 	limit: 10000,
                // 	name: 'static/img/[name].[hash:7].[ext]'
                // }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                include: path.join(__dirname, '../src/'),
                options: {
                    //将这一配置项设置成false即可，如果不设置这一项，html中的img路径是这样的{"default":"/static/img/b.024578a.jpg"}
                    esModule: false,
                    limit: 10000,
                    name: 'static/img/[name].[hash:7].[ext]'
                        //outputPath: 'img/',
                        //publicPath: '../'
                }
            },
            // 视频
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                include: path.join(__dirname, '../src/'),
                options: {
                    esModule: false,
                    limit: 10000,
                    name: 'static/media/[name].[hash:7].[ext]'
                }
            },
            // 字体
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 10000,
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            },
        ]
    },
    resolve: {
        // 使用的扩展名
        extensions: [".js", ".json", ".jsx", ".css", ".less"],
        alias: {
            "@": path.resolve(__dirname, "../src"),
            jquery: path.resolve('node_modules/jquery/dist/jquery.min.js')
        },
    },
    plugins: [
        //设置每一次build之前先删除dist  
        new CleanWebpackPlugin({
            // 默认false  dry为true时，模拟删除，假删除，不会真的删掉文件
            dry: false,
            verbose: false,
            // 删除指定文件/文件夹   
            cleanOnceBeforeBuildPatterns: ['../dist'],
            // 删除工作区外的文件夹是危险操作，要配置这项
            dangerouslyAllowCleanPatternsOutsideProject: true,
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
}
