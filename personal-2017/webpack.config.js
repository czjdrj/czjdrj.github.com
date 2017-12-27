var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");//按模板生成html 自动引入js
var ExtractTextPlugin = require("extract-text-webpack-plugin");//分离css
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");//压缩js
var CopyWebpackPlugin = require("copy-webpack-plugin");//

module.exports = {
	devtool: "none",//source-map、cheap-module-source-map、eval-source-map、cheap-module-eval-source-map
	entry: __dirname + "/src/js/index.js",//入口文件,“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
	output: {
		path: __dirname + "/dist",//打包输出位置
		filename: "js/bundle.js"//打包后的文件名
		// publicPath: "./",
	},
	//webpack-dev-server
	devServer: {
		contentBase: "./dist",//http://localhost:8080/ 虚拟服务器目录
		port: "8080",
		historyApiFallback: true,//如果设置为true，所有的跳转将指向index.html 适合单页面
		inline: true,//实时刷新
		hot: true
	},
	//加载loader
	module: {
		rules: [
			{
				test: /\.js$/,//需要处理目标文件的正则
				use: {
					loader: "babel-loader",//加载babel模块 babel-loader
					options: {
						presets: ["es2015"]//babel-core、babel-preset-es2015
					}
				},
				exclude: /node_modules///include/exclude 添加必须处理/屏蔽不需要处理 (文件或文件夹)
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",//可以把css通过入口文件和js打包在一起 style-loader
					use: [
						{
							loader: "css-loader",//可以使用import导入css的语法 css-loader
							options: {
								minimize: true//压缩css
								// modules: true//可以将css作为单独模块，多个模块的相同类名可互不影响
							}
						},
						{
							loader: "postcss-loader",//css添加浏览器前缀 postcss-loader
							options: {
								plugins: [
									require("autoprefixer")//浏览器前缀 autoprefixer
								]
							}
						}
					]
				}),
				exclude: /node_modules/
			},
			{
				test: /\.(png|gif|jpe?g)$/,//处理所有资源内url指向的文件，打包输出到原来的相对路径
				use: {
					loader: "file-loader",//file-loader
					options: {
						name: "[name].[ext]",
						outputPath: "images/",
						useRelativePath: true//使用相对路径
					}
				},
				exclude: /node_modules/
			}
		]
	},
	//插件
	plugins: [
		new webpack.BannerPlugin("------【czjdrj】------"),//显示版权插件
		new webpack.HotModuleReplacementPlugin(),//热加载插件
		new webpack.optimize.OccurrenceOrderPlugin(),//为组件分配ID 排序输出 减少文件大小
		new HtmlWebpackPlugin({
			template: "html-withimg-loader!" + __dirname + "/src/index.tmpl.html"//HtmlWebpackPlugin 配合 html-withimg-loader 打包html输出
		}),
		new CopyWebpackPlugin([
			{from: __dirname + "/src/js/lib",to: __dirname + "/dist/js/lib"}//拷贝不打包的库文件
		]),
		new ExtractTextPlugin("css/style.css"),
		new UglifyJSPlugin()
	]
}
