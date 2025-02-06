const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Nama plugin yang benar

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', // Lebih baik 'hidden-source-map' untuk production jika Anda tidak ingin source map diakses publik
  output: {
    filename: 'bundle.[contenthash].js', // Pastikan ini ada, dan gunakan [contenthash] untuk cache busting
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Bersihkan dist sebelum build
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css', // Nama file CSS dengan [contenthash]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // Aturan untuk CSS dan SCSS harus di webpack.common.js
    ],
  },
});