"use strict";

const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const baseConfig = require("./webpack.config");

module.exports = Object.assign({}, baseConfig, {
  mode: "production",

  devtool: false,

  output: {
    path: path.join(__dirname, "build", "min", "assets"),
    filename: "app.[hash].js",
  },

  plugins: [
    ...baseConfig.plugins.filter((plugin) => !(plugin instanceof MiniCssExtractPlugin)),

    new MiniCssExtractPlugin({ filename: "[name].[hash].css" }),
  ]
});
