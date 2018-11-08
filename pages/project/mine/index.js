// pages/project/mine/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  data: {
    scrollViewHeight:0,

    type:0,
    iconName: {
      '01': 'kaifa',
      '02': 'sheji',
      '03': 'yunying',
      '04': 'chanpin'
    },

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
          dictValue: '3'
        }
      ],
      currentState: 0,
      projects: [],
      pageIndex: 1,
      nomore: false
    }

  },

  onLoad:async function (options) {
    const query = wx.createSelectorQuery()
    query.select('#projects').fields({
      rect: true
    },res=>{
      wx.getSystemInfo({
        success:data=> {
          this.setData({
            scrollViewHeight:data.windowHeight-res.top
          })
        }
      })
    }).exec()

    await this.getPublishStates()
    this.getMyPublish()
    
  },

  onReady: function () {
    
  },

  onPullDownRefresh: function () {
    this.getMyPublish()
  },

  onReachBottom: function () {

  },

  scroll:function(e){
    wx.showToast({
      title: '111',
     
    })
  },

  switchList:function(e){
    let index = e.detail.index
    this.setData({
      type: index
    })
    if(index===0){
      this.data.myPublish.projects.length===0&&this.getMyPublish()
    }else{
      this.data.myApply.projects.length === 0 && this.getMyApply()
    }
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
    if (!app.checkLogin()) return 
    let myPublish=this.data.myPublish
    let res = await app.request.post('/project/projectInfo/myProjectList', {
      relationType:'1|3',
      projectState: myPublish.states[myPublish.currentState].dictValue
    })
    if (res.code !== 0)return 

    this.setData({
      'myPublish.projects':myPublish.projects.concat(res.data.list.map(item => {
        item.createTime = item.createTime.split(' ')[0]
        return item
      }))
    })
  },

  getMyApply:async function(){
    if (!app.checkLogin()) return
    let res = await app.request.post('/project/projectInfo/myProjectList', {
      relationType: 2
    })
    if (res.code !== 0) return

    this.setData({
      'myApply.projects': this.data.myApply.projects.concat(res.data.list.map(item => {
        item.createTime = item.createTime.split(' ')[0]
        return item
      }))
    })
  }

})