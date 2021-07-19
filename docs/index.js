import { ExampleApp } from './ExampleApp'

const render = () => ExampleApp.render({ node : document.body })

render()

if(module.hot) {
  module.hot.accept(['./ExampleApp'], () => {
    document.body = document.createElement('body')
    render()
  })
}
