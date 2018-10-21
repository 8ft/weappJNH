// pages/user/wxLogin/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  data: {
    title:'欢迎登录',
    encryptedData:'',
    iv:''
  },

  onLoad: function () {
    this.setData({
      title: wx.getStorageSync('user').expired?'您的登录状态已过期\n请重新登录':'欢迎登录'
    })
  },

  bindGetUserInfo:function(e) {
    if (e.detail.encryptedData) {
      this.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
      this.login()
    } else {
      wx.showToast({
        title: '需要授权才能继续哦',
        icon: 'none'
      })
    }
  },

  login:function(){
    let oid = wx.getStorageSync('openid')
    let uid = wx.getStorageSync('unionid')
    if (!oid || !uid) {
      wx.login({
        success: async res => {
          let data = await app.request.get('/weixin/mini/getOpenId', {
            code: res.code
          })
          wx.setStorageSync('openid', data.openid)
          if (data.unionid) {
            wx.setStorageSync('unionid', data.unionid)
            this.getUserData(data.openid, data.unionid)
          } else {
            //请求解密接口
          }
        }
      })
    } else {
      //获取用户信息
      this.getUserData(oid, uid)
    }
  },

  getUserData:async function(oid, uid){
    let res = await app.request.post('/user/userThirdpartInfo/login', {
      thirdpartIdentifier: oid,
      uid: uid,
      type: 0
    })

    let code = res.code
    if (code === 0) {
      wx.setStorageSync('user', res.data)
      let pages = getCurrentPages()
      pages[pages.length - 2].onLoad()
      wx.navigateBack()
    } else if (code === 507) {
      wx.redirectTo({
        url: '/pages/user/bind/index'
      })
    }
  }
})