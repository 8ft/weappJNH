// pages/mine/personalInfo/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    user:null
  },

  onLoad:function(){
    this.getInfo()
  },

  onShow:function(){
    app.checkLogin()
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
    if (this.data.user.userState === 1)return
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
  },

  delWorks:function(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success: async res=> {
        if (res.confirm) {
          let res = await app.request.post('/user/userAuth/deleteUserSample', {
            userSampleId: e.currentTarget.dataset.id
          })
          if (res.code === 0) {
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
            this.getInfo()
          }
        }
      }
    })
  },

  submit:async function(){
    let user = this.data.user
    if (!(Object.keys(user.userBaseInfo).length > 0)) {
      wx.showToast({
        title: '请完善基本信息',
        icon: 'none'
      })
      return
    } else if (!user.userIntro) {
      wx.showToast({
        title: '请完善详细介绍',
        icon: 'none'
      })
      return
    } else if (user.userIntro.length<100){
      wx.showToast({
        title: '详细介绍至少100字',
        icon: 'none'
      })
    } else if (!(user.userSkills.length > 0)) {
      wx.showToast({
        title: '至少添加一个技能',
        icon: 'none'
      })
      return
    } else if (!(user.userSampleInfos.length > 0)) {
      wx.showToast({
        title: '至少添加一个作品案例',
        icon: 'none'
      })
      return
    }

    let res = await app.request.post('/user/userAuth/submitUserAuth', {})
    if (res.code === 0){
      this.getInfo()
      wx.navigateTo({
        url: '/pages/mine/personalInfo/success/index',
        icon:'none'
      })
    }
  }

})