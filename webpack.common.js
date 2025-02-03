const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',

  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Bersihkan folder dist sebelum build baru
    assetModuleFilename: 'assets/[name][ext]', // Atur nama file untuk asset
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
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/, // Aturan untuk file SCSS
        use: [
          'style-loader', // Untuk development, gunakan MiniCssExtractPlugin.loader untuk production
          'css-loader',
          'postcss-loader', // Untuk autoprefixer
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
  ],
};