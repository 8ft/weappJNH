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
    
    height:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success:res=> {
        let ww=res.windowWidth,
          wh=res.windowHeight,
          height = wh * 750 / ww - 300

        this.setData({
          height: height
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