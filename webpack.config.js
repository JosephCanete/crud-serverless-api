const slsw = require("serverless-webpack");
const path = require("path");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  devtool: "inline-cheap-module-source-map",
  externals: ["aws-sdk"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      uuid: path.resolve(__dirname, "./node_modules/uuid"),
    },
  },
};
