// pages/project/publish/desc/index.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    inputLen:-1,
    conLen:0,
    demoShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      content: app.globalData.publishDataCache.desc
    })
  },

  onUnload: function () {
    app.globalData.publishDataCache.desc = this.data.content
  },

  input:function(e){
    let input = e.detail.value
    let conLen = input.replace(/[ ]/g, "").replace(/[\r\n]/g, "").length
    if(conLen===1000){
      this.setData({
        inputLen: input.length,
      })
    }else if(conLen<1000){
      this.setData({
        inputLen: -1
      })
    }
    this.setData({
      content: input,
      conLen: conLen
    })
  },

  hideDemo:function(){
    this.setData({
      demoShow:false
    })
  },

  showDemo:function(){
    this.setData({
      demoShow: true
    })
  }

})