import { HtmlForm, HtmlInput, HtmlButton } from '../lib'
import api from './api'

export class TodoForm extends HtmlForm
{
  getState() {
    return { text : '', busy : false }
  }

  render() {
    this.onsubmit = this.onSubmit.bind(this)
    return [
      this._input = new HtmlInput({
        disabled : this.state.busy,
        required : true,
        value : this.state.text,
        oninput : e => this.setState({ text : e.target.value }),
      }),
      new HtmlButton({
        disabled : this.state.busy,
        children : 'Add',
      }),
    ]
  }

  async onSubmit(e) {
    e.preventDefault()
    this.setState({ busy : true })
    await api.createItem({
      text : this.state.text.trim(),
      completed : false,
    })
    this.setState({ text : '', busy : false })
    this._input.node.focus()
  }
}
