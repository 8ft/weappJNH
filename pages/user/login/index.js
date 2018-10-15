// pages/user/login/index.js

//获取应用实例
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

const util = require('../../../utils/util.js')

Page({
  data: {

  },

  submit:async function(e){
    let val=e.detail.value
    util.validatePhone(val.phone)
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