const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/StringScrambler.js',
  output: {
    filename: 'StringScrambler.min.js',
    path: __dirname + '/dist',
    library: 'StringScrambler',
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
