import {
  HtmlImg, HtmlBody, HtmlHeader, HtmlMain, HtmlFooter, HtmlH1, HtmlButton, HtmlDiv,
} from '../lib'
import './index.css'

class SiteBody extends HtmlBody
{
  constructor(props) {
    super(props)
    this.state = { crazy : false }
  }

  render() {
    return [
      new HtmlHeader(new Wrapper(new HtmlImg({
        src : this.state.crazy? 'crazy7.jpg' : 'aristov.jpg',
        alt : 'UserPic',
      }))),
      new HtmlMain([
        new HtmlH1('Vyacheslav Aristov'),
        new HtmlButton({
          onclick : () => this.setState({ crazy : !this.state.crazy }),
          children : 'Toggle the userpic',
        }),
      ]),
      new HtmlFooter(['@ ', (new Date).getFullYear(), ' Vyacheslav Aristov']),
    ]
  }
}

class Div extends HtmlDiv
{
}

class Wrapper extends Div
{
}

export default () => new SiteBody({ node : document.body })
