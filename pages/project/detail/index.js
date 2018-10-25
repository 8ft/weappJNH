// pages/project/detail/index.js
//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    detail:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync('user')
    if(user){
      this.setData({
        uid: user.userId
      })
    }
    
    this.getDetail(options.no)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getDetail: async function (projectNo){
    let res = await app.request.post('/project/projectInfo/detail', {
      projectNo: projectNo
    })
    if(res.code===0){
      this.setData({
        detail: res.data
      })
    }
  }
})