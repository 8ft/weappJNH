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
    userInfo:null,
    editUserInfoCache:{
      jobTypes:null,
      detail: {
        content: ''
      }
    },
    publishDataCache:{
      skills:null,
      needSkills:[],
      needSkillsCn:[],
      desc:{
        content:''
      }
    }
  },
  request: request,
  util:util,
  checkLogin: () => {
    let user = wx.getStorageSync('user')
    if (!user || user.expired) {
      wx.navigateTo({
        url: '/pages/user/wxLogin/index',
      })
    }else{
      return true
    }
  }
})