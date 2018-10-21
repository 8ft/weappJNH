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

  getInfo: async function () {
    let res = await app.request.post('/user/userAuth/getUserBaseInfo', {})
    if (res.code === 0) {
      app.globalData.userInfo = res.data
      this.setData({
        user: res.data
      })
    }
  }
})
