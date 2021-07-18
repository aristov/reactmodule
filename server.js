process.env.NODE_ENV = 'development'

const express = require('express')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const config = require('./webpack.config')
const compiler = webpack(config)
const port = 8000

const app = express()

app.use(express.json({ limit : 500000 }))

app.use(devMiddleware(compiler, {
  publicPath : config.output.publicPath,
}))

app.use(hotMiddleware(compiler, {
  path : '/__webpack_hmr',
  heartbeat : 10 * 1000,
}))

app.use(express.static('docs'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${ port }`)
})

module.exports = app
