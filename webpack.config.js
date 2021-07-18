const path = require('path')

module.exports = {
  mode : 'none',
  context : path.join(__dirname, 'lib'),
  entry : {
    index : './index.js',
  },
  devtool : 'inline-source-map',
  output : {
    path : path.join(__dirname, 'dist'),
    filename : '[name].bundle.js',
  },
}
