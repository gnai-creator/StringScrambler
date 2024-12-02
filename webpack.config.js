const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/StringScrambler.js',
  output: {
    filename: 'StringScrambler.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'StringScrambler', // Nome global
    libraryTarget: 'umd', // Suporte universal
    globalObject: "typeof self !== 'undefined' ? self : this", // Suporte a navegador e Node.js
    libraryExport: 'default', // Exporta apenas a classe padrão
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
