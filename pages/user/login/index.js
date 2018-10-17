// pages/user/login/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    phone: '',
    code: '',
    getCodeTxt: '获取验证码',
    countDown: 60,
    userInfo:null
  },

  onLoad:function(){

  },

  input: function (e) {
    let inputName = e.currentTarget.dataset.name
    let val = e.detail.value
    switch (inputName) {
      case 'phone':
        this.setData({
          phone: val
        })
        break;
      case 'code':
        this.setData({
          code: val
        })
        break;
    }
  },

  getCode: async function () {
    let phone = this.data.phone
    if (!app.util.validatePhone(phone)) return
    let res = await app.request.post('/public/validateCode/sendValidateCode', {
      userMobile: phone,
      type: '3'
    })
    if (res) this.countDown()
  },

  countDown: function () {
    let tid = setTimeout(() => {
      let countDown = this.data.countDown
      if (countDown > 1) {
        countDown--
        this.setData({
          getCodeTxt: countDown + 's后重新获取',
          countDown: countDown
        })
        this.countDown()
      } else {
        this.setData({
          getCodeTxt: '重新获取',
          countDown: 60
        })
        clearTimeout(tid)
      }
    }, 1000)
  },

  bindGetUserInfo(e) {
    let info = e.detail.userInfo
    if(info){
      this.setData({
        userInfo:info
      })
      this.submit()
    }else{
      wx.showToast({
        title: '需要授权才能继续哦',
        icon: 'none'
      })
    }
  },

  login:async function(){
    if (!wx.getStorageSync('openId')) {
      wx.login({
        success: async res => {
          let data = await app.request.get('/weixin/mini/getOpenId', {
            code: res.code
          })

          wx.setStorageSync('openId', data.openid)

          let userData = await app.request.post('/user/userThirdpartInfo/login', {
            thirdpartIdentifier: data.openid,
            type: 0
          })

          if (userData.token){

          }else{
            this.bind()
          }
          
        }
      })
    }
  },

  bind:async function(){
    let phone=this.data.phone
    if(!app.util.validatePhone(phone))return

    let code = this.data.code
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }

    let userData = await app.request.post('/user/userThirdpartInfo/bind', {
      thirdpartIdentifier: data.openid,
      type:0,
      telephone: phone,
      validateCode:code,
      nickName: this.data.userInfo.nickName,
      userAvatar: this.data.userInfo.avatarUrl
    })

    if(userData){
      wx.setStorageSync('user', userData)
      wx.navigateBack()
    }
  }
})