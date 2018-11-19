// pages/project/mine/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    hasLogin:false,
    scrollViewHeight:0,

    typeIndex:0,
    iconName: {
      '01': 'kaifa',
      '02': 'sheji',
      '03': 'yunying',
      '04': 'chanpin'
    },

    pageSize:10,
    myPublish:{
      states: [
        {
          dictName: '全部',
          dictValue: ''
        }
      ],
      currentState:0,
      projects:[],
      pageIndex: 1,
      nomore: false
    },

    myApply: {
      states: [
        {
          dictName: '全部',
          dictValue: ''
        },
        {
          dictName: '申请中',
          dictValue: '4'
        },
        {
          dictName: '未通过',
          dictValue: '9'
        }
      ],
      currentState: 0,
      projects: [],
      pageIndex: 1,
      nomore: false
    }
  },

  onLoad:function (options) {
    app.addActiveTabbarPage()
    this.getPublishStates()
  },

  onUnload: function () {
    app.delActiveTabbarPage()
  },

  onShow:function(){
    const user = wx.getStorageSync('user')
    const hasLogin = (!user || user.expired) ? false : true
    this.setData({
      hasLogin: hasLogin
    })
    if(!hasLogin&&this.data.myPublish.projects.length>0){
      let myPublish=this.data.myPublish
      this.setData({
        'myPublish.currentState':0,
        'myPublish.projects': [],
        'myPublish.pageIndex': 1,
        'myPublish.nomore': false,
      })
    } else if (hasLogin && this.data.myPublish.projects.length === 0){
      if (this.data.scrollViewHeight===0){
        const query = wx.createSelectorQuery()
        query.select('#projects').fields({
          rect: true
        }, res => {
          wx.getSystemInfo({
            success: data => {
              this.setData({
                scrollViewHeight: data.windowHeight - res.top
              })
            }
          })
        }).exec()
      }
      this.refresh()
    }
  },

  refresh:function(e){
    if (this.data.typeIndex === 0) {
      let myPublish = this.data.myPublish
      this.setData({
        'myPublish.pageIndex': 1,
        'myPublish.nomore': false,
        'myPublish.projects': []
      })
      this.getMyPublish()
    } else {
      let myApply = this.data.myApply
      this.setData({
        'myApply.pageIndex': 1,
        'myApply.nomore': false,
        'myApply.projects': []
      })
      this.getMyApply()
    }
  },

  switchList:function(e){
    let index = e.detail.index
    this.setData({
      typeIndex: index
    })
    this.refresh()
  },

  switchState:function(e){
    const index = e.currentTarget.dataset.index
    if(this.data.typeIndex===0){
      this.setData({
        'myPublish.currentState':index
      })
    }else{
      this.setData({
        'myApply.currentState': index
      })
    }
    this.refresh()
  },

  getPublishStates: async function () {
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'project_state',
      resultType: '1'
    })

    if (res.code === 0) {
      this.setData({
        'myPublish.states': this.data.myPublish.states.concat(res.data.data[0].dictList)
      })
    }
  },

  getMyPublish:async function(){
    let myPublish = this.data.myPublish
    if (myPublish.nomore || !this.data.hasLogin) return 
    let res = await app.request.post('/project/projectInfo/myProjectList', {
      relationType:'1|3',
      projectState: myPublish.states[myPublish.currentState].dictValue,
      pageIndex: myPublish.pageIndex,
      pageSize:this.data.pageSize
    })
    if (res.code !== 0)return 

    if (res.data.count > myPublish.pageIndex*this.data.pageSize){
      myPublish.pageIndex++
    }else{
      this.setData({
        'myPublish.nomore':true
      })
    }

    this.setData({
      'myPublish.pageIndex': myPublish.pageIndex,
      'myPublish.projects':myPublish.projects.concat(res.data.list.map(item => {
        item.createTime = item.createTime.split(' ')[0]
        return item
      }))
    })
  },

  getMyApply:async function(){
    let myApply = this.data.myApply
    if (myApply.nomore||!this.data.hasLogin) return
    let res = await app.request.post('/project/projectInfo/myProjectList', {
      relationType: 2,
      projectState: myApply.states[myApply.currentState].dictValue,
      pageIndex: myApply.pageIndex,
      pageSize: this.data.pageSize
    })
    if (res.code !== 0) return

    if (res.data.count > myApply.pageIndex * this.data.pageSize) {
      myApply.pageIndex++
    } else {
      this.setData({
        'myApply.nomore': true
      })
    }

    this.setData({
      'myApply.pageIndex': myApply.pageIndex,
      'myApply.projects': myApply.projects.concat(res.data.list.map(item => {
        item.createTime = item.createTime.split(' ')[0]
        return item
      }))
    })
  }

})