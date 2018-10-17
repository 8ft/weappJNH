// pages/common/authButton/index.js

//获取应用实例
const app = getApp()

Component({
  externalClasses:['css'],
  /**
   * 组件的属性列表
   */
  properties: {
    txt:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo(e) {
      let info = e.detail.userInfo
      if (info) {
        app.globalData.userInfo = info
        this.triggerEvent('success')
      } else {
        wx.showToast({
          title: '需要授权才能继续哦',
          icon: 'none'
        })
      }
    }
  }
})
