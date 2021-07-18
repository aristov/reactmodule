import {
  HtmlImg, HtmlBody, HtmlHeader, HtmlMain, HtmlFooter, HtmlH1, HtmlButton, HtmlDiv, HtmlForm,
  HtmlInput, HtmlLabel, HtmlH2,
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
      new HtmlHeader([
        new Wrapper(new HtmlImg({
          src : this.state.crazy? 'crazy7.jpg' : 'aristov.jpg',
          alt : 'UserPic',
        })),
        new ToggleButton({
          onclick : () => this.setState({ crazy : !this.state.crazy }),
          children : this.state.crazy? 'Off' : 'On',
        }),
      ]),
      new HtmlMain([
        new HtmlH1('Vyacheslav Aristov'),
        new AuthForm,
      ]),
      new HtmlFooter(['© ', (new Date).getFullYear(), ' Vyacheslav Aristov']),
    ]
  }
}

class AuthForm extends HtmlForm
{
  constructor(props) {
    super(props)
    this.state = { busy : false }
  }

  render() {
    const disabled = !!this.state.busy
    this.node.addEventListener('submit', e => {
      e.preventDefault()
      this.setState({ busy : true })
    })
    return [
      new HtmlH2('Login'),
      new HtmlLabel([
        'Username',
        new HtmlInput({ disabled }),
      ]),
      new HtmlLabel([
        'Password',
        new HtmlInput({ type : 'password', disabled }),
      ]),
      new HtmlButton({ children : 'Enter', disabled }),
    ]
  }
}

class Div extends HtmlDiv
{
}

class Wrapper extends Div
{
}

class ToggleButton extends HtmlButton
{
}

export default () => new SiteBody({ node : document.body })
