// pages/mine/personalInfo/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    user:null
  },

  onShow:function(){
    if (app.checkLogin())
    this.getInfo()
  },

  getInfo:async function(){
    let res = await app.request.post('/user/userAuth/getUserBaseInfo', {})
    if (res.code === 0) {
      app.globalData.userInfo = res.data
      this.setData({
        user:res.data
      })  
    }
  },

  chooseImage:function(){
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
          this.uploadImage(res.tempFilePaths[0])
      }
    })
  },

  uploadImage:function(path){
    wx.uploadFile({
      url: 'https://api.dev.juniuhui.com/public/file/upload', 
      filePath: path,
      name: 'file',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'client_type': '30',
        'api_version': '1.0.0000',
        'token': wx.getStorageSync('user').token || ''
      },
      formData: {
        category: '1106',
        multiple: '0'
      },
      success:res=> {
        let data = JSON.parse(res.data)
        if (data.code === 0)
        this.updateAvatar(data.data.batchNo)
      }
    })
  },

  updateAvatar:async function(no){
    let res = await app.request.post('/user/userAuth/submitNickname', {
      nickName: '八疯兔',
      userAvatar: no
    })
    if (res.code === 0) this.getInfo()
  }

})