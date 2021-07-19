import {
  HtmlImg, HtmlBody, HtmlHeader, HtmlMain, HtmlFooter, HtmlH1, HtmlButton, HtmlDiv, HtmlForm,
  HtmlInput, HtmlLabel, HtmlH2,
} from '../lib'
import './index.css'

class SiteBody extends HtmlBody
{
  constructor(props) {
    super(props)
    this.state = { counter : 0 }
  }

  render() {
    const counter = this.state.counter || 0 // fixme
    return [
      new HtmlHeader([
        new Wrapper([
          !(counter % 2) && new HtmlImg({
            src : 'aristov.jpg',
            alt : 'UserPic',
          }),
          !!(counter % 3) && new HtmlImg({
            src : 'crazy7.jpg',
            alt : 'UserPic',
          }),
        ]),
        new ToggleButton({
          onclick : () => this.setState({ counter : this.state.counter + 1 }),
          children : counter.toString(),
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
