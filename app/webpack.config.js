"use strict";

const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const staticFileRegex = /\.(woff|svg|ttf|eot|gif|jpeg|jpg|png)([\?]?.*)$/;

module.exports = {
  mode: "development",

  context: __dirname,
  
  devtool: "source-map",

  entry: {
    app: [
      "whatwg-fetch",
      "./src/app.tsx",
      "./src/app.less"
    ]
  },

  module: {
    rules: [
      { test: /\.js$/, loader: "source-map-loader", enforce: "pre" },

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // Handle less with less-loader.
      {
          test: /\.less$/,
          use: [
              {
                  loader: MiniCssExtractPlugin.loader,
              },
              "css-loader",
              "less-loader",
          ],
      },

      // Load in static files.
      {
	  test: staticFileRegex,
	  include: [
	      path.resolve(__dirname, "node_modules"),
	  ],
	  loader: "file-loader",
	  query: {
	      name: "assets/[path][name].[ext]",
	  },
      },

    ],
  },

  output: {
    path: path.join(__dirname, "build", "src", "assets"),
    filename: "app.js"
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new HtmlWebpackPlugin({
      inject: false,
      minify: {
        collapseWhitespace: true,
      },
      template: path.resolve(__dirname, "src/index.html"),
      title: "Application",
    }),
  ],

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  }
};
