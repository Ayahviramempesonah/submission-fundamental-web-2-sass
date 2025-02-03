const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');


 
module.exports = merge(common, {
  mode: 'production',
   devtool: 'source-map',
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
});