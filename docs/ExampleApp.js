import {
  HtmlImg, HtmlBody, HtmlHeader, HtmlMain, HtmlFooter, HtmlH1, HtmlButton, HtmlDiv, HtmlForm,
  HtmlInput, HtmlLabel, HtmlH2,
} from '../lib'
import './index.css'

export class ExampleApp extends HtmlBody
{
  constructor(props) {
    super(props)
    this.state = { counter : 0 }
  }

  render() {
    const counter = this.state.counter
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
    this.state = { busy : false, username : null }
  }

  render() {
    const disabled = !!this.state.busy
    const username = this.state.username
    this.node.ariaBusy = String(disabled)
    this.node.addEventListener('submit', e => {
      e.preventDefault()
      const username = this._userBox.node.value.trim()
      this.setState({ busy : true })
      setTimeout(() => this.setState({ busy : false, username }), 500)
    })
    if(username) {
      return new HtmlH2(`Welcome ${ username }!`)
    }
    return [
      new HtmlH2('Login'),
      new HtmlLabel([
        'Username',
        this._userBox = new HtmlInput({ required : true, disabled }),
      ]),
      new HtmlLabel([
        'Password',
        new HtmlInput({ type : 'password', required : true, disabled }),
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
