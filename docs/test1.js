import { Component, render, HtmlButton, HtmlSection, HtmlDiv, HtmlImg } from '../lib'

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
        onclick : () => {
          this.setState({ expanded : !this.state.expanded })
        },
        children : expanded? 'Switch: ON' : 'Switch: OFF',
      }),
      new HtmlSection({
        hidden : !expanded,
        children : text,
      }),
      new HtmlDiv(expanded && new HtmlImg({
        src : 'crazy7.jpg',
        alt : 'Crazy!',
      })),
    ]
  }
}

export default () => render(new HtmlArticle, document.body)
