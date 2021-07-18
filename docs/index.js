import test from './test2'

test()

if(module.hot) {
  // module.hot.accept(['./test1'], () => location.reload())
  module.hot.accept(['./test2'], () => {
    document.body.innerHTML = ''
    test()
  })
}
