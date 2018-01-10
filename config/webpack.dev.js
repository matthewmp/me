var path = require('path');

module.exports = {
	entry:{
		main: './src/main.js'
	},
	output: {
		filename: 'main-bundle.js',
		path: path.resolve(__dirname, '../dist')
	},
	devServer: {
		contentBase: 'dist',
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: "[name].html"
						}
					},
					{
						loader: "extract-loader"
					},
					{
						loader: "html-loader",
						options: {
							attrs: ["img:src", "video:src"]
						}
					}
				]
			},
			{
				test: /\.(jpg|gif|png|jpeg|mov|wav|mp4)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: "./images/[name].[ext]"
						}
					}
				]
			}
		]
	}
}