import { HtmlDiv, HtmlForm, HtmlUl, HtmlLi, HtmlInput, HtmlButton } from '../lib'
import './TodoApp.css'

export class TodoApp extends HtmlDiv
{
  constructor(props) {
    super(props)
    this.state = { items : api.getItems() }
    api.addEventListener('update', this.onUpdate)
  }

  render() {
    return [
      new TodoForm,
      new TodoList({ items : this.state.items }),
    ]
  }

  onUpdate = e => {
    this.setState({ items : e.detail })
  }

  removeAllListeners() {
    super.removeAllListeners()
    api.removeEventListener('update', this.onUpdate)
  }
}

class TodoForm extends HtmlForm
{
  render() {
    this.on('submit', this.onSubmit)
    return [
      this._input = new HtmlInput({ required : true }),
      new HtmlButton('Добавить'),
    ]
  }

  onSubmit = e => {
    e.preventDefault()
    api.createItem({
      text : this._input.node.value.trim(),
      completed : false,
    })
    this._input.node.value = ''
  }
}

class TodoList extends HtmlUl
{
  render() {
    return this.props.items.map(item => new TodoItem({ item, key : item.id }))
  }
}

class TodoItem extends HtmlLi
{
  render() {
    const item = this.props.item
    return [
      this._checkbox = new HtmlInput({
        type : 'checkbox',
        defaultChecked : item.completed,
        onchange : () => api.updateItem({
          id : item.id,
          completed : this._checkbox.node.checked,
        }),
      }),
      new HtmlDiv(item.text),
      new HtmlButton({
        children : 'Удалить',
        onclick : () => api.removeItem(item.id),
      }),
    ]
  }
}

class AppInteface extends EventTarget
{
  constructor() {
    super()
    this._load()
  }

  _load() {
    const data = localStorage.getItem('TodoApp.items')
    return this._data = data? JSON.parse(data) : []
  }

  _save() {
    localStorage.setItem('TodoApp.items', JSON.stringify(this._data))
    this.dispatchEvent(new CustomEvent('update', { detail : this._data.slice() }))
  }

  getItems() {
    return this._data.slice()
  }

  createItem(item) {
    item.id = Date.now()
    this._data.push(item)
    // this._data.unshift(item)
    this._save()
  }

  updateItem(newItem) {
    const item = this._data.find(item => item.id === newItem.id)
    Object.assign(item, newItem)
    this._save()
  }

  removeItem(id) {
    this._data = this._data.filter(item => item.id !== id)
    this._save()
  }

  reorderItems(type) {
    type === 'pop' && this._data.unshift(this._data.pop())
    type === 'push' && this._data.push(this._data.shift())
    this._save()
    // return this._data
  }
}

const api = window.api = new AppInteface
