const path = require('path');

module.exports = {
  entry: './frontend/src/index.tsx',
  output: { path: path.join(__dirname, '../server/src/public'), filename: 'bundle.js' },
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       pathRewrite: {
  //         "^/api": ""
  //       },
  //     }
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.join(__dirname, 'src', 'index.ejs'),
  //     title: 'Chat App',
  //   }),
  // ],
};
