const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config();

module.exports = {
  entry: './src/frontend/src/index.tsx',
  output: { path: path.join(__dirname, '../server/src/public'), filename: 'bundle.js' },
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
