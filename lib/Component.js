import events from './events'

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
    this.node.__instance = this
    this.__handlers = new Set
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
      if(!props.hasOwnProperty(name)) {
        continue
      }
      value = props[name]
      if(name === 'node' || name === 'children' || value === undefined) {
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

  setState(state) {
    Object.assign(this.state, state)
    this.updateChildren(this.props.children)
  }

  updateChildren(oChildren = []) {
    const nChildren = this.props.children = this.normalizeChildren(this.render())
    const length = Math.max(oChildren.length, nChildren.length)
    let i, oChild, nChild
    for(i = 0; i < length; i++) {
      oChild = oChildren[i]
      nChild = nChildren[i]
      if(!oChild) {
        nChild.props && nChild.updateChildren()
        this.node.append(nChild.node)
        continue
      }
      oChild.props && oChild.removeAllListeners()
      if(!nChild) {
        oChild.node.remove()
        continue
      }
      if(!oChild.props && !nChild.props) {
        if(oChild.node.data !== nChild.node.data) {
          oChild.node.data = nChild.node.data
        }
        nChildren[i] = oChild
        continue
      }
      if(oChild.node.tagName === nChild.node.tagName) {
        nChild.updateElem(oChild)
        continue
      }
      nChild.props && nChild.updateChildren()
      oChild.node.replaceWith(nChild.node)
    }
  }

  updateElem(elem) {
    const node = elem.node
    let attr, name, value
    for(attr of node.attributes) {
      value = this.node.getAttribute(attr.name)
      if(value === null) {
        node.removeAttribute(attr.name)
      }
      else if(value !== attr.value) {
        node.setAttribute(attr.name, value)
      }
    }
    for(attr of this.node.attributes) {
      if(node.getAttribute(attr.name) !== attr.value) {
        node.setAttribute(attr.name, attr.value)
      }
    }
    for(name of this.__handlers) {
      node[name] = this.node[name]
      this.node[name] = null
    }
    if(elem.constructor === this.constructor) {
      Object.assign(this.state, elem.state)
    }
    this.node = node
    this.node.__instance = this
    this.updateChildren(elem.props.children)
  }

  normalizeChildren(children) {
    const result = []
    for(const child of [children].flat(Infinity)) {
      if(child === false || child === null || child === undefined) {
        continue
      }
      result.push(child.node? child : { node : new Text(child) })
    }
    return result
  }

  render() {
    return this.props.children
  }

  removeAllListeners() {
    this.__handlers.forEach(name => this[name] = null)
  }

  findAll(subject, filter, _firstOnly) {
    const result = []
    let child, constructor
    for(child of this.props.children) {
      if(!child.props) {
        continue
      }
      constructor = child.constructor
      do if(constructor === subject) {
        if(filter && !filter(child)) {
          continue
        }
        result.push(child)
        if(_firstOnly) {
          return result
        }
      }
      while(constructor = Object.getPrototypeOf(constructor))
      result.push(...child.findAll(subject, filter))
    }
    return result
  }

  findOne(subject, filter) {
    return this.findAll(subject, filter, true)[0] || null
  }

  static render(props, parentNode) {
    const instance = new this(props)
    instance.updateChildren()
    parentNode?.append(instance.node)
  }

  static defineEvent(type) {
    const name = 'on' + type
    Object.defineProperty(this.prototype, name, {
      configurable : true,
      set(callback) {
        if(this.node[name] = callback) {
          this.__handlers.add(name)
        }
        else this.__handlers.delete(name)
      },
      get() {
        return this.node[name]
      },
    })
  }
}

Component.events = events

for(const type of Object.keys(events)) {
  Component.defineEvent(type)
}
