import { HtmlDiv, HtmlForm, HtmlUl, HtmlLi, HtmlInput, HtmlButton } from '../lib'
import './TodoApp.css'

export class TodoApp extends HtmlDiv
{
  state = { items : null }

  render() {
    if(!this.state.items) {
      return new HtmlDiv('Loading...')
    }
    return [
      new TodoForm,
      new TodoList({ items : this.state.items }),
    ]
  }

  async componentDidMount() {
    api.addEventListener('update', this.onUpdate)
    this.setState({ items : await api.getItems() })
  }

  onUpdate = e => {
    this.setState({ items : e.detail })
  }

  componentWillUnmount() {
    api.removeEventListener('update', this.onUpdate)
  }
}

class TodoForm extends HtmlForm
{
  state = { text : '', busy : false }

  render() {
    this.onsubmit = this.onSubmit
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

  onSubmit = async e => {
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

class TodoList extends HtmlUl
{
  render() {
    return this.props.items.map(item => (
      new TodoItem({ item, id : 'ID' + item.id })
    ))
  }
}

class TodoItem extends HtmlLi
{
  state = { busy : false }

  render() {
    const item = this.props.item
    this.node.setAttribute('aria-busy', this.state.busy)
    return [
      new HtmlInput({
        type : 'checkbox',
        checked : item.completed,
        disabled : this.state.busy,
        onchange : this.onChange,
      }),
      new HtmlDiv(item.text),
      new HtmlButton({
        children : 'Delete',
        disabled : this.state.busy,
        onclick : this.onRemove,
      }),
    ]
  }

  onChange = async () => {
    const item = this.props.item
    this.setState({ busy : true })
    await api.updateItem({
      id : item.id,
      completed : !item.completed,
    })
    this.setState({ busy : false })
  }

  onRemove = async () => {
    this.setState({ busy : true })
    await api.removeItem(this.props.item.id)
  }
}

const DELAY = 500

class AppInteface extends EventTarget
{
  constructor() {
    super()
    const json = localStorage.getItem('TodoApp.items')
    this._data = json ? JSON.parse(json) : []
  }

  async _save() {
    localStorage.setItem('TodoApp.items', JSON.stringify(this._data))
    await new Promise(resolve => setTimeout(resolve, DELAY))
    this.dispatchEvent(new CustomEvent('update', { detail : this._data.slice() }))
  }

  async getItems() {
    return new Promise(resolve => setTimeout(() => resolve(this._data.slice()), DELAY))
  }

  async createItem(item) {
    item.id = Date.now()
    this._data.unshift(item)
    return this._save()
  }

  async updateItem(item) {
    const oldItem = this._data.find(({ id }) => id === item.id)
    Object.assign(oldItem, item)
    return this._save()
  }

  async removeItem(id) {
    this._data = this._data.filter(item => item.id !== id)
    return this._save()
  }

  async reorderItems(type) {
    type === 'pop' && this._data.unshift(this._data.pop())
    type === 'push' && this._data.push(this._data.shift())
    return this._save()
  }
}

const api = window.api = new AppInteface
