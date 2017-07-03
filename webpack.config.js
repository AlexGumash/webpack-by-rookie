const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const dist = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

module.exports = {
  context: src,
  entry: {
    app: './app.js',
    about: './about.js'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
        	fallback: 'style-loader',
        	use: ['css-loader', 'stylus-loader']
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: dist,
    compress: true,
    port: 3001,
    stats: "errors-only"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'gumash-webpack',
      hash: true,
      excludeChunks: ['about'],
      filename: 'index.html',
      template: './index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'gumash-webpack',
      hash: true,
      chunks: ['about'],
      filename: 'about.html',
      template: './about.html'
    }),
    new ExtractTextPlugin({
      filename: "app.css",
      disable: false,
      allChunks: true
    })
  ]
}
