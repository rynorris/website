"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  
  devtool: "source-map",

  entry: {
    app: [
      "./src/app.tsx"
    ]
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
    ],
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  output: {
    path: path.join(__dirname, "build", "src"),
    filename: "app.js"
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
  ],

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  }
};
