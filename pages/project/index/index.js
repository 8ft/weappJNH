//index.js
//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
   banners:null,
   types: ['全部'],
   pageIndex: 1,
   projects:[],
   nomore: false,
   hasLogin:false
  },

  onLoad:async function () {
    this.setData({
      hasLogin: wx.getStorageSync('unionid')?true:false
    })
    this.getBanner()
    await this.getProjectTypes()
    await this.getProjects()
  },

  onShow:function(){
    //登录状态改变，刷新列表
    let hasLogin=wx.getStorageSync('unionid')?true:false
    if (hasLogin !== this.data.hasLogin){
      this.setData({
        hasLogin: hasLogin,
        pageIndex: 1,
        projects: [],
        nomore: false
      })
      this.getProjects()
    }
  },

  onPullDownRefresh:function(){
    this.setData({
      pageIndex:1,
      projects:[],
      nomore:false
    })
    this.getProjects()
  },

  onReachBottom:function(){
    this.getProjects()
  },

  getBanner:async function(){
    let res = await app.request.post('/public/appActivityMenu/getList', {
      menuClass: 'home_banner',
      clientVersion: '1.0.0'
    })
    if(res.code===0){
      this.setData({
        banners: res.data
      })
    }
  },

  getProjectTypes:async function(){
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'project_type', 
      resultType: '1'
    })

    if (res.code === 0) {
      let list=res.data.data[0].dictList
      let types = list.map((item) => {
        return item.dictName
      })
      
      this.setData({
        types: this.data.types.concat(types)
      })
    }
  },

  getProjects: async function (){
    let nomore = this.data.nomore
    if (nomore)return

    let pIndex = this.data.pageIndex
    let res = await app.request.post('/project/projectInfo/getList',{
      pageIndex:pIndex,
      pageSize:10
    })

    if (res.code === 0) {
      let list = res.data.list.map((project) => {
        project.projectSkill = project.projectSkill.split('|')
        return project
      })
      if (res.data.page > pIndex){
        pIndex++
      }else{
        nomore=true
      }
    
      this.setData({
        projects: this.data.projects.concat(list),
        pageIndex:pIndex,
        nomore:nomore
      })
    }

    wx.stopPullDownRefresh()
  },
  
  bannerJump:function(e){
    let obj=e.currentTarget.dataset.obj
    switch (obj.menuType){
      case 'view':
        wx.navigateTo({
          url: `/pages/common/webview/index?url=${encodeURIComponent(obj.menuUrl)}`
        })
      break;
      case 'click':
      break;
    }
  }
})
