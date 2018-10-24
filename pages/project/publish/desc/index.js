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
    demoShow:false,
    bottom:0,
    maxHeight:400,
    ratio:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success:res=> {
        let ww=res.windowWidth,
          wh=res.windowHeight,
          ratio = 750 / ww

        this.setData({
          ratio:ratio,
          maxHeight:wh*ratio-300
        })
      }
    })

    let data = app.globalData.publishDataCache.desc
    this.setData({
      content: data.content,
      inputLen:data.inputLen||-1,
      conLen:data.conLen||0
    })
  },

  onUnload: function () {
    app.globalData.publishDataCache.desc = this.data
  },

  focus:function(e){
    this.setData({
      bottom: e.detail.height*this.data.ratio
    })
  },

  blur:function(e){
    this.setData({
      bottom:0
    })
  },

  input:function(e){
    let input = e.detail.value
    let conLen = input.replace(/[ ]/g, "").replace(/[\r\n]/g, "").length
    if(conLen===5000){
      wx.showToast({
        title: '字数不能超过5000',
        icon:'none'
      })
      this.setData({
        inputLen: input.length,
      })
    }else if(conLen<5000){
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