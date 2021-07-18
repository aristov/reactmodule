import { Component, render } from './Component'

// const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

class HtmlButton extends Component
{
}

class HtmlSection extends Component
{
}

class HtmlArticle extends Component
{
  constructor(props) {
    super(props)
    this.state = { expanded : false }
  }

  render() {
    super.render()
    return [
      new HtmlButton({
        onclick : () => this.setState({ expanded : !this.state.expanded }),
        children : 'Toggle',
      }),
      new HtmlSection({
        hidden : !this.state.expanded,
        children : text,
      }),
    ]
  }
}

// const app = new HtmlArticle([new HtmlButton('Toggle'), new HtmlSection(text)])
const app = new HtmlArticle

render(app, document.getElementById('root'))
