const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/StringScrambler.js', // Arquivo de entrada
  output: {
    filename: 'StringScrambler.min.js', // Nome do arquivo de saída
    path: path.resolve(__dirname, 'dist'),
    library: 'StringScrambler', // Nome da biblioteca exportada
    libraryTarget: 'umd', // Tipo de exportação
    globalObject: 'this', // Garante compatibilidade com Node.js e navegadores
  },
  optimization: {
    minimize: true, // Habilita minificação
    minimizer: [new TerserPlugin()],
  },
};
