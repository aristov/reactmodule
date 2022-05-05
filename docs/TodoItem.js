import { HtmlLi, HtmlInput, HtmlDiv, HtmlButton } from '../lib'
import api from './api'

export class TodoItem extends HtmlLi
{
  getState() {
    return { busy : false }
  }

  render() {
    const item = this.props.item
    this.node.setAttribute('aria-busy', this.state.busy)
    return [
      new HtmlInput({
        type : 'checkbox',
        checked : item.completed,
        disabled : this.state.busy,
        onchange : this.onChange.bind(this),
      }),
      new HtmlDiv(item.text),
      new HtmlButton({
        children : 'Delete',
        disabled : this.state.busy,
        onclick : this.onRemove.bind(this),
      }),
    ]
  }

  async onChange() {
    const item = this.props.item
    this.setState({ busy : true })
    await api.updateItem({
      id : item.id,
      completed : !item.completed,
    })
    this.setState({ busy : false })
  }

  async onRemove() {
    this.setState({ busy : true })
    await api.removeItem(this.props.item.id)
  }
}
