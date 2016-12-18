"use strict";

const path = require("path");

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
  }
};
