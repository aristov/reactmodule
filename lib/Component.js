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

  render() {
    return this.props.children
  }

  setState(state) {
    Object.assign(this.state, state)
    this.updateChildren(this.props.children)
  }

  updateChildren(oChildren = []) {
    const nChildren = this.props.children = this.normalizeChildren(this.render())
    const length = Math.max(oChildren.length, nChildren.length)
    let i, oChild, oNode, nChild, nNode
    for(i = 0; i < length; i++) {
      oChild = oChildren[i]
      nChild = nChildren[i]
      if(nNode = nChild?.node) {
        nChild.updateElem(oChild)
      }
      else nNode = nChild
      if(!oChild) {
        this.node.append(nNode)
        continue
      }
      oNode = oChild?.node || oChild
      if(!nChild) {
        oNode.remove()
        continue
      }
      if(!oChild.node && !nChild.node) {
        if(oNode.data !== nNode.data) {
          oNode.data = nNode.data
        }
        nChildren[i] = oNode
        continue
      }
      if(oChild.tagName === nChild.tagName) {
        continue
      }
      oNode.replaceWith(nNode)
    }
  }

  updateElem(oElem) {
    if(!oElem) {
      this.updateChildren()
      return
    }
    const oNode = oElem.node
    const nNode = this.node
    let oAttr, oValue, nAttr, nValue
    for(oAttr of oNode.attributes) {
      nValue = nNode.getAttribute(oAttr.name)
      if(nValue === null) {
        oNode.removeAttribute(oAttr.name)
      }
      else if(nValue !== oAttr.value) {
        oNode.setAttribute(oAttr.name, nValue)
      }
    }
    for(nAttr of nNode.attributes) {
      oValue = oNode.getAttribute(nAttr.name)
      if(oValue !== nAttr.value) {
        oNode.setAttribute(nAttr.name, nAttr.value)
      }
    }
    if(oElem.constructor === this.constructor) {
      Object.assign(this.state, oElem.state)
    }
    this.node = oNode
    this.updateChildren(oElem.props.children)
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

  findAll(subject, filter, _firstOnly) {
    const result = []
    let child, constructor
    for(child of this.props.children) {
      if(!child.node) {
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
}
