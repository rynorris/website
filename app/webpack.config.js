"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    app: [
      "./build/tmp/app.js",
    ]
  },
  output: {
    path: path.join(__dirname, "build", "src"),
    filename: "app.js"
  },
  module: {
    loaders: [
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
	  inject: false,
	  minify: {
	      collapseWhitespace: true,
	  },
	  template: path.resolve(__dirname, "src/index.html"),
	  title: "Application",
      }),
  ]
};
