export class Component
{
  constructor(props = {}) {
    console.log(this.constructor.name, 'constructor', ...arguments)
    if(props.constructor !== Object) {
      props = { children : props }
    }
    this.props = props
    this.state = {}
    this.node = document.createElement(this.constructor.localName)
    for(const name in props) {
      if(props.hasOwnProperty(name)) {
        name === 'children' || this.set(name, props[name])
      }
    }
    this.setChildren(this.render())
  }

  set(name, value) {
    console.log(this.constructor.name, 'set', ...arguments)
    if(value === undefined) {
      return
    }
    if(name in this) {
      this[name] = value
    }
    else if(name in this.node) {
      this.node[name] = value
    }
  }

  setChildren(...children) {
    console.log(this.constructor.name, 'setChildren', ...arguments)
    Array.from(this.node.childNodes).forEach(node => node.remove())
    for(const child of children.flat(Infinity)) {
      child === null || child === false || this.node.append(child.node || child)
    }
  }

  render() {
    console.log(this.constructor.name, 'render', this.props.children)
    return this.props.children
  }

  setState(state) {
    console.log(this.constructor.name, 'setState', ...arguments)
    Object.assign(this.state, state)
    this.setChildren(this.render())
  }

  static get localName() {
    return this.name.slice(4)
  }
}

export function render(component, node) {
  node.append(component.node)
}
