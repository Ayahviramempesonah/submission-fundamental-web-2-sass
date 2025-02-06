const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Perbaikan: Nama plugin yang benar

module.exports = {
  entry: './src/main.js',

  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'assets/[name][ext]',
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        }, // Perbaikan: Hapus miniCssExtractPlugin.loader dari sini
      },
      {
        test: /\.css$/,
        use: [
          // Perbaikan: Gunakan conditional loader untuk development dan production
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          // Perbaikan: Gunakan conditional loader untuk development dan production
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer, // Gunakan autoprefixer langsung, tidak perlu require di dalam options
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement',
      template: './src/index.html',
      inject: 'body',
    }),
    // Perbaikan: Plugin hanya di production
    ...(process.env.NODE_ENV === 'production' ? [new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    })] : []),
  ],
};