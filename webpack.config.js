const path = require('path')

module.exports = {
  mode : 'none',
  context : path.join(__dirname, 'docs'),
  entry : {
    test1 : './test1.js',
  },
  devtool : 'inline-source-map',
  output : {
    path : path.join(__dirname, 'dist'),
    filename : '[name].bundle.js',
  },
}
