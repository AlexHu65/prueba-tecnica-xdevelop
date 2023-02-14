const path = require('path');

const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
	mode: 'development',
	entry: './src/js/app.js',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'assets/js'),
	},
	module: {
		rules: [
		  {
			test: /\.vue$/,
			loader: 'vue-loader'
		  },
		  {
			test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
			use: [
				'url-loader?name=assets/[name].[ext]',
			]
			}
		]
	  },
	  plugins: [
		new VueLoaderPlugin()
	  ]
};