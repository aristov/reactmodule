export class Component
{
  constructor(props = {}) {
    // console.log(this.constructor.name, 'constructor', ...arguments)
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
    // console.log(this.constructor.name, 'set', ...arguments)
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
    // console.log(this.constructor.name, 'setChildren', ...arguments)
    Array.from(this.node.childNodes).forEach(node => node.remove())
    for(const child of children.flat(Infinity)) {
      if(child !== false && child !== null && child !== undefined) {
        this.node.append(child.node || child)
      }
    }
  }

  render() {
    // console.log(this.constructor.name, 'render', this.props.children)
    return this.props.children
  }

  setState(state) {
    // console.log(this.constructor.name, 'setState', ...arguments)
    Object.assign(this.state, state)
    this.updateChildren(Array.from(this.node.childNodes))
  }

  normalizeChildren(children) {
    const result = []
    for(const child of [children].flat(Infinity)) {
      if(child === false || child === null || child === undefined) {
        continue
      }
      result.push(child.node? child : new Text(child))
    }
    return result
  }

  updateChildren(childNodes) {
    const children = this.normalizeChildren(this.render())
    const nodes = Array.from(childNodes)
    const length = Math.max(nodes.length, children.length)
    let i, newChild, oldNode, oldAttr, oldValue, newNode, newAttr, newValue
    for(i = 0; i < length; i++) {
      oldNode = nodes[i]
      newChild = children[i]
      if(!newChild) {
        oldNode.remove()
        continue
      }
      newNode = newChild.node || newChild
      if(!oldNode) {
        this.node.append(newNode)
        continue
      }
      if(oldNode.isEqualNode(newNode)) {
        continue
      }
      if(oldNode.nodeType !== newNode.nodeType) {
        oldNode.replaceWith(newNode)
        continue
      }
      if(newNode.nodeType === Node.TEXT_NODE) {
        if(oldNode.data !== newNode.data) {
          oldNode.data = newNode.data
        }
        continue
      }
      if(oldNode.tagName !== newNode.tagName) {
        oldNode.replaceWith(newNode)
        continue
      }
      for(oldAttr of oldNode.attributes) {
        newValue = newNode.getAttribute(oldAttr.name)
        if(newValue === null) {
          oldNode.removeAttribute(oldAttr.name)
        }
        else if(newValue !== oldAttr.value) {
          oldNode.setAttribute(oldAttr.name, newValue)
        }
      }
      for(newAttr of newNode.attributes) {
        oldValue = oldNode.getAttribute(newAttr.name)
        if(oldValue !== newAttr.value) {
          oldNode.setAttribute(newAttr.name, newAttr.value)
        }
      }
      newChild.updateChildren(oldNode.childNodes)
    }
  }

  static get localName() {
    return this.name.slice(4)
  }
}

export function render(component, node) {
  node.append(component.node)
}
