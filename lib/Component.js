export class Component
{
  constructor(props = {}) {
    if(props.constructor !== Object) {
      props = { children : props }
    }
    this.props = props
    this.state = {}
    this.node = props.node || document.createElement(this.constructor.tagName)
    for(const name in props) {
      if(props.hasOwnProperty(name)) {
        name === 'children' || this.set(name, props[name])
      }
    }
    this.updateChildren(this.node, this.render())
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
    // console.log(this.constructor.name + '.render()')
    return this.props.children
  }

  setState(state) {
    Object.assign(this.state, state)
    this.updateChildren(this.node, this.render())
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

  static get tagName() {
    let object = this
    do if(object.name.startsWith('Html')) {
      return object.name.slice(4)
    }
    while(object = Object.getPrototypeOf(object))
  }
}

export function render(component, node) {
  node.append(component.node)
}
