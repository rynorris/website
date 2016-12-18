"use strict";

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
