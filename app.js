//app.js
const request = require('./api/request.js')
const util = require('./utils/util.js')

App({
  onLaunch: function () {
    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  globalData: {
    version: '1.0.0',
    publishDataCache:{
      skills:null,
      needSkills:[],
      needSkillsCn:[],
      desc:''
    }
  },
  request: request,
  util:util,
  checkLogin: () => {
    if (!wx.getStorageSync('user')) {
      request.login()
      return false
    }else{
      return true
    }
  }
})