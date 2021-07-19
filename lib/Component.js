export class Component
{
  constructor(props = {}) {
    if(props.constructor !== Object) {
      props = { children : props }
    }
    else if(!props.children) {
      props.children = []
    }
    this.state = {}
    this.props = props
    this.node = props.node || this.createElemNode()
    props.className || this.setAutoClassName()
    this.setProps(props)
  }

  createElemNode() {
    let constructor = this.constructor
    do if(constructor.name.startsWith('Html')) {
      return document.createElement(constructor.name.slice(4))
    }
    while(constructor = Object.getPrototypeOf(constructor))
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

  setProps(props) {
    let name, value
    for(name in props) {
      if(props.hasOwnProperty(name)) {
        value = props[name]
        if(name === 'children' || value === undefined) {
          continue
        }
        if(name in this) {
          this[name] = value
        }
        else if(name in this.node) {
          this.node[name] = value
        }
      }
    }
  }

  render() {
    return this.props.children
  }

  setState(state) {
    Object.assign(this.state, state)
    this.updateChildren(this.props.children)
  }

  createChildren() {
    const children = this.props.children = this.normalizeChildren(this.render())
    let child, node
    for(child of children) {
      if(child.node) {
        node = child.node
        child.createChildren()
      }
      else node = child
      this.node.append(node)
    }
  }

  updateChildren(children0) {
    const children1 = this.props.children = this.normalizeChildren(this.render())
    const length = Math.max(children0.length, children1.length)
    let i, child0, node0, child1, node1
    for(i = 0; i < length; i++) {
      child0 = children0[i]
      child1 = children1[i]
      node0 = child0?.node || child0
      node1 = child1?.node || child1
      if(!child0) {
        this.node.append(node1)
        continue
      }
      if(!child1) {
        node0.remove()
        continue
      }
      if(node0.nodeType !== node1.nodeType) {
        node0.replaceWith(node1)
        continue
      }
      if(node1.nodeType === Node.TEXT_NODE) {
        if(node0.data !== node1.data) {
          node0.data = node1.data
          children1[i] = node0
        }
        continue
      }
      if(node0.tagName !== node1.tagName) {
        node0.replaceWith(node1)
        continue
      }
      this._updateAttributes(node0, node1)
      if(child0.constructor === child1.constructor) {
        Object.assign(child1.state, child0.state)
      }
      child1.node = node0
      child1.updateChildren(child0.props.children)
    }
  }

  _updateAttributes(node0, node1) {
    let attr0, value0, attr1, value1
    for(attr0 of node0.attributes) {
      value1 = node1.getAttribute(attr0.name)
      if(value1 === null) {
        node0.removeAttribute(attr0.name)
      }
      else if(value1 !== attr0.value) {
        node0.setAttribute(attr0.name, value1)
      }
    }
    for(attr1 of node1.attributes) {
      value0 = node0.getAttribute(attr1.name)
      if(value0 !== attr1.value) {
        node0.setAttribute(attr1.name, attr1.value)
      }
    }
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

  static render(props, parentNode) {
    const instance = new this(props)
    instance.createChildren()
    parentNode?.append(instance.node)
  }
}
