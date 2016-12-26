"use strict";

const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const baseConfig = require("./webpack.config");

module.exports = Object.assign({}, baseConfig, {
  devtool: null,

  output: {
    path: path.join(__dirname, "build", "min", "assets"),
    filename: "app.[hash].js",
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ]
});
