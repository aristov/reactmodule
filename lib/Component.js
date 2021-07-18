export class Component
{
  constructor(props = {}) {
    if(props.constructor !== Object) {
      props = { children : props }
    }
    this.state = {}
    this.props = props
    this.node = props.node || this.createElemNode()
    this.setAutoClassName()
    for(const name in props) {
      if(props.hasOwnProperty(name)) {
        name === 'children' || this.set(name, props[name])
      }
    }
    this.updateChildren(this.node, this.props.children = this.render())
  }

  set(name, value) {
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

  render() {
    return this.props.children
  }

  setState(state) {
    Object.assign(this.state, state)
    this.updateChildren(this.node, this.props.children = this.render())
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

  updateChildren(node, children) {
    children = this.normalizeChildren(children)
    const nodes = Array.from(node.childNodes)
    const length = Math.max(nodes.length, children.length)
    let i, newChild, oldNode, oldAttr, oldValue, newNode, newAttr, newValue
    for(i = 0; i < length; i++) {
      newChild = children[i]
      oldNode = nodes[i]
      if(!newChild) {
        oldNode.remove()
        continue
      }
      newNode = newChild.node || newChild
      if(!oldNode) {
        node.append(newNode)
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
      newChild.updateChildren(oldNode, newChild.props.children)
    }
  }

  setAutoClassName() {
    const classList = this.node.classList
    let constructor = this.constructor
    do {
      if(constructor.name.startsWith('Html')) {
        break
      }
      classList.add(constructor.name)
    }
    while(constructor = Object.getPrototypeOf(constructor))
  }

  createElemNode() {
    let constructor = this.constructor
    do if(constructor.name.startsWith('Html')) {
      return document.createElement(constructor.name.slice(4))
    }
    while(constructor = Object.getPrototypeOf(constructor))
  }
}
