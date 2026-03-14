const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'game.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3006,
    hot: true,
    open: false
  },
  resolve: {
    extensions: ['.js']
  }
};
