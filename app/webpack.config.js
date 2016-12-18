module.exports = {
  // configuration
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: __dirname + "/build",
    publicPath: "/assets/",
    filename: "app_[hash].js"
  }
};
