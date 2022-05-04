import { TodoApp } from './TodoApp'

const render = () => {
  new TodoApp({ parent : document.body })
}

render()

if(module.hot) {
  module.hot.accept(['./TodoApp'], () => {
    document.body = document.createElement('body')
    render()
  })
}
