// import { ExampleApp } from './ExampleApp'
import { TodoApp } from './TodoApp'

// const render = () => ExampleApp.render({ node : document.body })
const render = () => TodoApp.render({}, document.body)

render()

if(module.hot) {
  // module.hot.accept(['./ExampleApp'], () => {
  module.hot.accept(['./TodoApp'], () => {
    document.body = document.createElement('body')
    render()
  })
}
