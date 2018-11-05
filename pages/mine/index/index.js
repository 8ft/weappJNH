//index.js
//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    hasLogin:false,
    user:null,
    state:''
  },

  onShow:function(){
    let user = wx.getStorageSync('user')
    let hasLogin = (!user || user.expired) ? false : true
    this.setData({
      hasLogin: hasLogin
    })
    if (hasLogin){
      this.getInfo()
    }else{
      this.setData({
        state:''
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

      let state=''
      switch(res.data.userState){
        case 0:
          state='请完善'
          break;
        case 1:
          state = '审核中'
          break;
        case 2:
          state = '审核通过'
          break;
        case 3:
          state = '审核未通过'
          break;
      }

      this.setData({
        user: res.data,
        state:state
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
            app.refreshPages('logout')
            this.onShow()
          }
        }
      }
    })
  }
})
