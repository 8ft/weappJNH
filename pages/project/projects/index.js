// pages/index/projects/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  data: {
    dicts: [],
    typeCode: '',
    budgetCode: '',
    cycleCode: '',

    filter:'',

    pageIndex: 1,
    projects: [],
    nomore: false
  },

  onLoad: function (options) {
    let type = options.type
    if(type){
      this.setData({
        typeCode:type
      })
    }

    this.getDicts()
    this.getProjects()
  },

  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 1,
      projects: [],
      nomore:false
    })
    this.getProjects()
  },

  onReachBottom: function () {
    this.getProjects()
  },

  getDicts: async function () {
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'project_type|price_budget|project_cycle',
      resultType: '1'
    })

    if(res.code===0){
      this.setData({
        dicts: this.data.dicts.concat(res.data.data)
      })
    }
  },

  getProjects: async function () {
    let nomore = this.data.nomore
    if (nomore) return

    let pIndex = this.data.pageIndex
    let res = await app.request.post('/project/projectInfo/getList', {
      projectType:this.data.typeCode,
      priceBudget:this.data.budgetCode,
      projectCycle:this.data.cycleCode,
      pageIndex: pIndex,
      pageSize: 10
    })

    if(res.code===0){
      let list = res.data.list.map((project) => {
        project.projectSkill = project.projectSkill.split('|')
        return project
      })

      if (res.data.page > pIndex) {
        pIndex++
      } else {
        nomore = true
      }

      this.setData({
        projects: this.data.projects.concat(list),
        pageIndex: pIndex,
        nomore: nomore
      })
    }

    wx.stopPullDownRefresh()
  },

  filter:function(e){
    let data=e.currentTarget.dataset
    switch(data.type){
      case 'type':
        this.setData({
          typeCode:data.code
        })
      break;
      case 'budget':
        this.setData({
          budgetCode: data.code
        })
        break;
      case 'cycle':
        this.setData({
          cycleCode: data.code
        })
        break;
    }

    this.setData({
      nomore: false,
      pageIndex: 1,
      projects: []
    })
    this.getProjects()
    this.close()
  },

  select: function (e) {
    if(this.data.filter){
      this.setData({
        filter:''
      })
    }else{
      this.setData({
        filter: e.currentTarget.dataset.name
      })
    }
  },
  close:function(){
    this.setData({
      filter: ''
    })
  }
})