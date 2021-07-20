import { HtmlDiv, HtmlForm, HtmlUl, HtmlLi, HtmlInput, HtmlButton } from '../lib'
import './TodoApp.css'

export class TodoApp extends HtmlDiv
{
  constructor(props) {
    super(props)
    this.state = { items : null }
    api.addEventListener('update', this.onUpdate)
  }

  render() {
    if(!this.state.items) {
      return new HtmlDiv('Загрузка...')
    }
    return [
      new TodoForm,
      new TodoList({ items : this.state.items }),
    ]
  }

  async componentDidMount() {
    this.setState({ items : await api.getItems() })
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
  constructor(props) {
    super(props)
    this.state = { busy : false }
  }

  render() {
    const disabled = this.state.busy
    this.on('submit', this.onSubmit)
    return [
      this._input = new HtmlInput({ required : true, disabled }),
      this._button = new HtmlButton({ children : 'Добавить', disabled }),
    ]
  }

  onSubmit = async e => {
    e.preventDefault()
    this.setState({ busy : true })
    await api.createItem({
      text : this._input.node.value.trim(),
      completed : false,
    })
    this._input.node.value = ''
    this.setState({ busy : false })
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
  constructor(props) {
    super(props)
    this.state = { busy : false }
  }

  render() {
    const item = this.props.item
    const busy = this.state.busy
    this.node.setAttribute('aria-busy', busy)
    return [
      this._checkbox = new HtmlInput({
        type : 'checkbox',
        defaultChecked : item.completed,
        disabled : busy,
        onchange : this.onChange,
      }),
      new HtmlDiv(item.text),
      new HtmlButton({
        children : 'Удалить',
        disabled : busy,
        onclick : this.onRemove,
      }),
    ]
  }

  onChange = async () => {
    this.setState({ busy : true })
    await api.updateItem({
      id : this.props.item.id,
      completed : this._checkbox.node.checked,
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
    this._data = json? JSON.parse(json) : []
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
    this._data.push(item)
    // this._data.unshift(item)
    return this._save()
  }

  async updateItem(newItem) {
    const item = this._data.find(item => item.id === newItem.id)
    Object.assign(item, newItem)
    return this._save()
  }

  async removeItem(id) {
    this._data = this._data.filter(item => item.id !== id)
    return this._save()
  }

  reorderItems(type) {
    type === 'pop' && this._data.unshift(this._data.pop())
    type === 'push' && this._data.push(this._data.shift())
    void this._save()
    // return this._data
  }
}

const api = window.api = new AppInteface
