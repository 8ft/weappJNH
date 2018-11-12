// pages/expert/index/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  data: {
    user:null
  },

  onLoad: function (options) {
    this.getUserInfo(options.id)
  },

  getUserInfo: async function (id) {
    let res = await app.request.post('/user/userAuth/viewUserBaseInfo', {
      userId: id
    })

    let data=res.data
    data.userBaseInfo.positionTypeCn = data.userBaseInfo.positionTypeCn.split('|')

    if (res.code === 0) {
      this.setData({
        user:data
      })
    }
  }

 
})