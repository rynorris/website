"use strict";

var path = require("path");

module.exports = {
  context: __dirname,
  entry: {
    app: [
      "./build/tmp/index.js",
    ]
  },
  output: {
    path: path.join(__dirname, "build", "src"),
    filename: "app.js"
  }
};
