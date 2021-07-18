import { Component, render } from './Component'

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

class HtmlArticle extends Component
{
  constructor(props) {
    super(props)
    this.state = { expanded : false }
  }

  render() {
    const expanded = this.state.expanded
    return [
      new HtmlButton({
        onclick : () => this.setState({ expanded : !this.state.expanded }),
        children : 'Toggle',
      }),
      new HtmlSection({
        hidden : !expanded,
        children : text,
      }),
      new HtmlDiv(!expanded && new HtmlImg({
        src : 'tmp/Progress.svg',
        alt : 'Progress',
      })),
    ]
  }
}

class HtmlButton extends Component
{
}

class HtmlImg extends Component
{
}

class HtmlDiv extends Component
{
}

class HtmlSection extends Component
{
}

render(new HtmlArticle, document.getElementById('root'))
