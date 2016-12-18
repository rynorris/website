"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const staticFileRegex = /\.(woff|svg|ttf|eot|gif|jpeg|jpg|png)([\?]?.*)$/;

module.exports = {
  context: __dirname,
  
  devtool: "source-map",

  entry: {
    app: [
      "./src/app.tsx",
      "./src/app.less"
    ]
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // Handle less with less-loader.
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },

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
      }
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
