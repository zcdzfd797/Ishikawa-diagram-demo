const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src/main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash:8].js",
    clean: true,
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      vue$: "vue/dist/vue.runtime.esm.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/i,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name].[contenthash:8][ext]",
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 8081,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
    static: {
      directory: path.resolve(__dirname, "public"),
    },
  },
  performance: {
    hints: false,
  },
};
