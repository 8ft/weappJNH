// pages/user/wxLogin/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  data: {
    encryptedData:'',
    iv:''
  },

  onLoad: function () {
    let oid = wx.getStorageSync('openid'),
      uid = wx.getStorageSync('unionid')

    if (!oid || !uid) {
      wx.login({
        success: async res => {
          let data = await app.request.get('/weixin/mini/getOpenId', {
            code: res.code
          })

          oid = data.openid
          wx.setStorageSync('openid', oid)

          uid = data.unionid
          if (uid) {
            wx.setStorageSync('unionid', uid)
          } 
        }
      })
    }
  },

  bindGetUserInfo:function(e) {
    if (e.detail.encryptedData) {
      this.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
      this.preLogin()
    } else {
      wx.showToast({
        title: '需要授权才能继续哦',
        icon: 'none'
      })
    }
  },

  preLogin:async function(){
    let oid = wx.getStorageSync('openid'),
       uid = wx.getStorageSync('unionid')

    if (!uid) {
      //请求解密接口
      let decodeData = await app.request.get('/weixin/mini/getUnionId', {
        encryptedData: this.data.encryptedData,
        iv:this.data.iv,
        openId: oid
      })

      if (decodeData.status===1){
        uid = decodeData.userInfo.unionid
        wx.setStorageSync('unionid', uid)
        this.login(oid, uid)
      }else{
        wx.showToast({
          title: decodeData.msg,
          icon:'none'
        })
      }
    } else {
      //获取用户信息
      this.login(oid, uid)
    }
  },

  login:async function(oid, uid){
    let res = await app.request.post('/user/userThirdpartInfo/login', {
      thirdpartIdentifier: oid,
      uid: uid,
      type: 0
    })

    let code = res.code
    if (code === 0) {
      wx.setStorageSync('user', res.data)
      this.getUserInfo()
    } else if (code === 507) {
      wx.redirectTo({
        url: '/pages/user/bind/index'
      })
    }
  },

  getUserInfo: async function () {
    let res = await app.request.post('/user/userAuth/getUserBaseInfo', {})
    if (res.code !== 0) return
    
    app.globalData.userInfo = res.data
    let pages = getCurrentPages()
    pages[pages.length - 2].onLoad()
    wx.navigateBack()
  }
})