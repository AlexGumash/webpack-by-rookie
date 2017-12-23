const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const kek = require("./src/kek.json");
const browsers = require("./package").browsers;

const dist = path.join(__dirname, "dist");
const src = path.join(__dirname, "src");

const autoprefixerBrowsers = [
  "Android >= " + browsers.android,
  "Chrome >= " + browsers.chrome,
  "Firefox >= " + browsers.firefox,
  "Explorer >= " + browsers.ie,
  "iOS >= " + browsers.ios,
  "Opera >= " + browsers.opera,
  "Safari >= " + browsers.safari
].map(browser => `"${browser}"`);

const autoprefixerLoader = `autoprefixer-loader?{browsers:[${autoprefixerBrowsers}]}`;

const IsProd = process.env.NODE_ENV === "production";
const cssDev = [
  "style-loader",
  "css-loader",
  autoprefixerLoader,
  "stylus-loader"
];
const cssProd = ExtractTextPlugin.extract({
  fallback: "style-loader",
  use: ["css-loader", "stylus-loader"]
});
const cssConfig = IsProd ? cssProd : cssDev;

module.exports = {
  context: src,
  entry: {
    app: "./scripts/app.js",
    about: "./scripts/about.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
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
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: ["file-loader?name=images/[name].[ext]", "image-webpack-loader"]
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
      title: "gumash-webpack",
      hash: true,
      filename: "index.html",
      template: "./views/index.pug",
      excludeChunks: ["about"],
      content: kek
    }),
    new HtmlWebpackPlugin({
      title: "gumash-webpack",
      hash: true,
      filename: "about.html",
      template: "./views/about.pug",
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
};
