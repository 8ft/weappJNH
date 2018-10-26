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
    detail:null,
    imgs:[],
    docs: [],
    docTemps:[]
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

  viewFile:function(e){
    let data = e.currentTarget.dataset
    let index=data.index

    let docTemps = this.data.docTemps
    let doc = docTemps[index]

    if(!doc){
      wx.showLoading({
        title: '下载文档中',
      })
      let url =data.url
      wx.downloadFile({
        url: url,
        success: res=>{
          const filePath = res.tempFilePath
          docTemps.push(filePath)
          this.setData({
            docTemps: docTemps
          })
          wx.hideLoading()
          this.openDoc(filePath)
        }
      })
    }else{
     this.openDoc(doc)
    }
  },

  openDoc:function(doc){
    wx.openDocument({
      filePath: doc,
      fail: function (res) {
        wx.showToast({
          title: '打开文档失败',
          icon: 'none'
        })
      }
    })
  },

  getDetail: async function (projectNo){
    let res = await app.request.post('/project/projectInfo/detail', {
      projectNo: projectNo
    })
    if(res.code===0){
      let imgs, docs

      if (res.data.fileBatchNo){
        let files = res.data.filesArr
        imgs = files.filter(item=>{
          return /(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/.test(item.fileName)
        })
        docs = files.filter(item => {
          return /(\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.pdf)/.test(item.fileName)
        })
      }
      
      this.setData({
        detail: res.data,
        imgs: imgs,
        docs:docs
      })
    }
  }
})