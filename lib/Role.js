import { Component } from './Component'

export class Role extends Component
{
  constructor(props) {
    super(props)
    this.setRoleAttr()
  }

  createElemNode() {
    return document.createElement('div')
  }

  setAutoClassName(prefix = 'Role') {
    super.setAutoClassName(prefix)
  }

  setRoleAttr() {
    let constructor = this.constructor
    do if(constructor.name.startsWith('Role')) {
      this.node.setAttribute('role', constructor.name.slice(4))
      return
    }
    while(constructor = Object.getPrototypeOf(constructor))
  }
}
