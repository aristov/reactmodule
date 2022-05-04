import events from './events'
import morphdom from 'morphdom'

export class Component
{
  constructor(props = {}) {
    this.__handlers = {}
    this.props = props = this.normalizeProps(props)
    this.state = this.getState()
    this.node = props.node || this.createNode()
    this.node.__instance = this
    props.className || this.setAutoClassName()
    this.setProps(props)
    this.setChildren(this.normalizeChildren(this.render()))
    this.setParent(props.parent)
  }

  normalizeProps(props) {
    if(props.constructor !== Object) {
      props = { children : props }
    }
    else if(!props.children) {
      props.children = []
    }
    return props
  }

  getState() {
    return {}
  }

  createNode() {
    let constructor = this.constructor
    do if(constructor.name.startsWith('Html')) {
      return document.createElement(constructor.name.slice(4))
    }
    while(constructor = Object.getPrototypeOf(constructor))
  }

  setAutoClassName(prefix = 'Html') {
    const classList = this.node.classList
    let constructor = this.constructor
    do {
      if(constructor.name.startsWith(prefix)) {
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

  setChildren(children) {
    this.props.children = children
    this.node.append(...children.map(child => child.node || child))
  }

  normalizeChildren(children) {
    const result = []
    for(const child of [children].flat(Infinity)) {
      if(child === false || child === null || child === undefined) {
        continue
      }
      result.push(child)
    }
    return result
  }

  setParent(parent) {
    if(!parent) {
      return
    }
    const node = parent.node || parent
    node.append(this.node)
    setTimeout(() => this.componentDidMount())
  }

  setState(state) {
    Object.assign(this.state, state)
    const children = this.normalizeChildren(this.render())
    const fragment = new DocumentFragment
    fragment.append(...children.map(child => child.node || child))
    morphdom(this.node, fragment, options)
    this.componentDidUpdate()
  }

  render() {
    return this.props.children
  }

  componentDidMount() {
    void null
  }

  componentDidUpdate() {
    void null
  }

  componentWillUnmount() {
    void null
  }

  static defineEvent(type) {
    const name = 'on' + type
    Object.defineProperty(this.prototype, name, {
      configurable : true,
      set(callback) {
        if(this.node[name] = callback) {
          this.__handlers[name] = callback
        }
        else delete this.__handlers[name]
      },
      get() {
        return this.node[name]
      },
    })
  }
}

/**
 * @type {MorphDomOptions}
 */
const options = {
  childrenOnly : true,
  onNodeAdded(toNode) {
    if(toNode.hasOwnProperty('__instance')) {
      toNode.__instance.componentDidMount()
    }
  },
  onBeforeElUpdated(fromNode, toNode) {
    if(toNode.hasOwnProperty('__instance') && fromNode.hasOwnProperty('__instance')) {
      toNode.__instance.state = fromNode.__instance.state
    }
  },
  onBeforeElChildrenUpdated(fromNode, toNode) {
    if(toNode.hasOwnProperty('__instance') && fromNode.hasOwnProperty('__instance')) {
      for(const type of Object.keys(fromNode.__instance.__handlers)) {
        fromNode[type] = null
      }
      for(const type of Object.keys(toNode.__instance.__handlers)) {
        fromNode[type] = toNode[type]
        toNode[type] = null
      }
      toNode.__instance.node = fromNode
      fromNode.__instance = toNode.__instance
      toNode.__instance = null
    }
  },
  onElUpdated(fromNode) {
    if(fromNode.hasOwnProperty('__instance')) {
      fromNode.__instance.componentDidUpdate()
    }
  },
  onBeforeNodeDiscarded(fromNode) {
    if(fromNode.hasOwnProperty('__instance')) {
      fromNode.__instance.componentWillUnmount()
    }
  },
  onNodeDiscarded(fromNode) {
    if(fromNode.hasOwnProperty('__instance')) {
      for(const type of Object.keys(fromNode.__instance.__handlers)) {
        fromNode[type] = null
      }
      fromNode.__instance.node = null
      fromNode.__instance = null
    }
  },
}

for(const type of Object.keys(events)) {
  Component.defineEvent(type)
}
