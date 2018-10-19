// pages/user/wxLogin/index.js
Page({

  data: {
    encryptedData:'',
    iv:''
  },

  onLoad: function (options) {

  },

  bindGetUserInfo(e) {
    console.log(e)
    if (e.detail.encryptedData) {
      this.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
    } else {
      wx.showToast({
        title: '需要授权才能继续哦',
        icon: 'none'
      })
    }
  },
})