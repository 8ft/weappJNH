//index.js
//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    hasLogin:false,
    user:null
  },

  onShow:function(){
    let user = wx.getStorageSync('user')
    let hasLogin = (!user || user.expired) ? false : true
    this.setData({
      hasLogin: hasLogin
    })

    if (hasLogin && !app.globalData.userInfo) {
      this.getInfo()
    }else{
      this.setData({
        user: app.globalData.userInfo
      })
    }
  },

  go:function(e){
    if (!app.checkLogin()) return 
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  getInfo: async function () {
    let res = await app.request.post('/user/userAuth/getUserBaseInfo', {})
    if (res.code === 0) {
      app.globalData.userInfo = res.data
      this.setData({
        user: res.data
      })
    }
  },

  logout:function(){
    wx.showModal({
      title: '提示',
      content: '确定要退出吗',
      success: async res => {
        if (res.confirm) {
          let res = await app.request.post('/user/userAuth/logout', {})
          if (res.code === 0) {
            app.globalData = {
              version: '1.0.0',
              userInfo: null,
              editUserInfoCache: {
                jobTypes: null,
                detail: {
                  content: ''
                }
              },
              publishDataCache: {
                skills: null,
                needSkills: [],
                needSkillsCn: [],
                desc: {
                  content: ''
                }
              }
            }
            wx.clearStorageSync()
            this.onShow()
          }
        }
      }
    })
  }
})
