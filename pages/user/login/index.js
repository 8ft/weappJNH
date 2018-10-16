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
          await app.request.get('/weixin/mini/getOpenId', {
            code: res.code
          })
        }
      })
    }
  },

  submit:async function(e){
    let val=e.detail.value
    app.util.validatePhone(val.phone)
    // if(!val.phone){
    //   wx.showToast({
    //     title: '请输入手机号码',
    //     icon:'none'
    //   })
    //   return
    // }
    
    // if (!val.pwd) {
    //   wx.showToast({
    //     title: '请输入密码',
    //     icon: 'none'
    //   })
    //   return
    // }
    
  }
})