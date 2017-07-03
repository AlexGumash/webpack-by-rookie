const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require('path');

const dist = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

const IsProd = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader','css-loader','stylus-loader'];
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'stylus-loader']
});
const cssConfig = IsProd ? cssProd : cssDev;

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
        use: cssConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.pug$/,
        use: "pug-loader"
      }
    ]
  },
  devServer: {
    contentBase: dist,
    compress: true,
    port: 3001,
    hot: true,
    stats: "errors-only"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'gumash-webpack',
      hash: true,
      filename: "index.html",
      template: './index.pug',
      excludeChunks: ["about"]
    }),
    new HtmlWebpackPlugin({
      title: 'gumash-webpack',
      hash: true,
      filename: "about.html",
      template: './about.pug',
      chunks: ["about"]
    }),
    new ExtractTextPlugin({
      filename: "app.css",
      disable: !IsProd,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
  ]
}
