import { Component } from './Component'

export class Role extends Component
{
  constructor(props) {
    super(props)
    this.setRoleAttr()
  }

  createNode() {
    return document.createElement('div')
  }

  setClassName(prefix = 'Role') {
    super.setClassName(prefix)
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
