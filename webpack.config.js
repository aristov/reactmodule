const webpack = require('webpack')
const path = require('path')
const HMR_SCRIPT = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

exports.mode = 'none'

exports.context = path.join(__dirname, 'docs')

exports.entry = {
  index : ['./index.js', HMR_SCRIPT],
}

exports.output = {
  path : path.join(__dirname, 'docs/assets'),
  publicPath : '/assets/',
  filename : '[name].bundle.js',
}

exports.module = {
  rules : [
    {
      test : /\.css$/,
      use : [
        'style-loader',
        {
          loader : 'css-loader',
          options : {
            importLoaders : 1,
          },
        },
      ],
    },
  ],
}

exports.plugins = [new webpack.HotModuleReplacementPlugin]
