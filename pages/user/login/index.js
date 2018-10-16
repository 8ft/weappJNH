// pages/user/login/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {

  },
  onLoad:function(){
    // 登录
    if (!wx.getStorageSync('openId')) {
      wx.login({
        success:async res => {
          let data=await app.request.get('/weixin/mini/getOpenId', {
            code: res.code
          })
          wx.setStorageSync('openId', data.openid)
        }
      })
    }
  },

  submit:async function(e){
    let val=e.detail.value
    if(!app.util.validatePhone(val.phone))return
    if (!app.util.validatePwd(val.pwd)) return
    let res=await app.request.post('/user/userAuth/login', {
      userMobile: val.phone,
      userPassword: val.pwd,
      openId: wx.getStorageSync('openId')
    })
    wx.setStorageSync('user', res)
    wx.navigateBack()
  }
})