import { Component, render } from './Component'

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

render(new HtmlArticle, document.getElementById('root'))
