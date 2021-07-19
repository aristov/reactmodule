import {
  HtmlImg, HtmlBody, HtmlHeader, HtmlMain, HtmlFooter, HtmlH1, HtmlButton, HtmlDiv, HtmlForm,
  HtmlInput, HtmlLabel, HtmlH2, Role
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
        new RoleButton('RoleButton'),
        new Button('Button'),
        new MenuButton('MenuButton'),
        new HtmlH1('Vyacheslav Aristov'),
        new AuthForm,
        new HtmlButton({
          children : 'findAll',
          onclick : () => {
            // const result = this.findAll(HtmlInput, input => input.node.type === 'password')
            // const result = this.findAll(HtmlButton, null, 2)
            const result = this.findAll(RoleButton)
            console.log(result)
            console.log(result.map(item => item.node))
          },
        }),
        '   ',
        new HtmlButton({
          children : 'findOne',
          onclick : () => {
            const result = this.findOne(HtmlImg)
            console.log(result, result?.node)
          },
        }),
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
    this.on('submit', this.onSubmit)
    if(username) {
      return [
        new HtmlH2(`Welcome ${ username }!`),
        new HtmlButton({ children : 'Logout', disabled }),
      ]
    }
    return [
      new HtmlH2('Login'),
      new HtmlLabel([
        'Username',
        this._userBox = new HtmlInput({
          required : true,
          value : 'Vasya Pupkin',
          disabled,
        }),
      ]),
      new HtmlLabel([
        'Password',
        new HtmlInput({
          type : 'password',
          required : true,
          value : 'qwerty',
          disabled,
        }),
      ]),
      new HtmlButton({ children : 'Enter', disabled }),
    ]
  }

  onSubmit = e => {
    e.preventDefault()
    this.setState({ busy : true })
    setTimeout(() => this.setState({
      busy : false,
      username : this.state.username? null : this._userBox.node.value.trim(),
    }), 500)
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

export class RoleButton extends Role
{
}

class Button extends RoleButton
{
}

class MenuButton extends Button
{
}
