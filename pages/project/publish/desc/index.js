// pages/project/publish/desc/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../../libs/regenerator-runtime.js')
//引入apis库
const apis = require('../../../../api/apis.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    inputLen:-1,
    conLen:0,
    demoShow:false,

    batchNo:'',
    imgs:[],
    
    height:''
  },

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

    let cache = app.globalData.publishDataCache.desc
    this.setData({
      content: cache.content.replace(/(^[\s\r\n]*)|([\s\r\n]*$)/g, ""),
      inputLen: cache.inputLen||-1,
      conLen: cache.conLen||0,
      batchNo: cache.batchNo||'',
      imgs:cache.imgs||[]
    })
  },

  onUnload: function () {
    if(this.data.imgs.length===0){
      this.data.batchNo=''
    }
    app.globalData.publishDataCache.desc = this.data
  },

  input:function(e){
    let input = e.detail.value
    let validInput = input.replace(/(^[\s\r\n]*)|([\s\r\n]*$)/g, "")
    let conLen = validInput.length

    let inputLen
    if(conLen>=5000){
      input = validInput.slice(0,5000)
      conLen=5000
      inputLen=5000
    }else if(conLen<5000){
      inputLen= -1
    }
    this.setData({
      content: input,
      conLen: conLen,
      inputLen:inputLen
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
  },

  chooseImage: function () {
    let count = 3 - this.data.imgs.length
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:async res => {
        let batchNo = this.data.batchNo
        let imgs = await apis.uploadFiles(res.tempFiles, '1108', batchNo)
        if (!batchNo) {
          this.setData({
            batchNo: imgs[0].batchNo
          })
        }
        this.setData({
          imgs: this.data.imgs.concat(imgs)
        })
      }
    })
  },

  delImg:function(e){
    this.data.imgs.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgs:this.data.imgs
    })
  },

  preview:function(e){
    let curUrl=e.currentTarget.dataset.url
    let urls=this.data.imgs.map(img=>{
      return img.url
    })
    wx.previewImage({
      urls:urls,
      current:curUrl
    })
  }

})