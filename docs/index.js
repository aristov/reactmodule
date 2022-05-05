import { TodoApp } from './TodoApp'

const render = app => {
  app?.destroy()
  return new TodoApp({ parent : document.body })
}

let app = render()

if(module.hot) {
  module.hot.accept(['./TodoApp'], () => app = render(app))
}
