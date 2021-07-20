// import { ExampleApp } from './ExampleApp'
import { TodoApp } from './TodoApp'

// const render = () => ExampleApp.render({ node : document.body })
const render = () => {
  TodoApp.render({}, document.body)
  // document.querySelectorAll('.TodoItem')[0].style = 'color:red;'
  // new MutationObserver(console.log).observe(document.body, { childList : true, subtree : true })
}

render()

if(module.hot) {
  // module.hot.accept(['./ExampleApp'], () => {
  module.hot.accept(['./TodoApp'], () => {
    document.body = document.createElement('body')
    render()
  })
}
