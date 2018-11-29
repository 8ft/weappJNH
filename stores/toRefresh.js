const extendObservable = require('../libs/mobx').extendObservable;

const pages = {
  'login': [
    'project/index/index',
    'project/mine/index',
    'project/publish/index/index',
    'project/list/index'
  ],
  'logout': [
    'project/index/index',
    'project/publish/index/index'
  ],
  'applied': [
    'project/index/index',
    'project/mine/index',
    'project/list/index',
    'project/detail/index'
  ]
}

const toRefresh = function () {
  extendObservable(this, {
    list: []
  });

  this.updateList = scene=>{
    pages[scene].forEach(url => {
      this.add(url)
    })
  }

  this.add = url => {
    if(this.list.indexOf(url)===-1){
      this.list.push(url)
    }
  }

  this.refresh = (url,fn) =>{
    const index = this.list.indexOf(url)
    if (index > -1){
      fn()
      this.list.splice(index, 1)
    }
  }
}

module.exports = new toRefresh