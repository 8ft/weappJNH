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
    no:'',
    isMyProject:false,
    detail:null,
    imgs:[],
    docs: [],
    docTemps:[],
    applyUsers:null,
    applyInfo:null,
    shareTitles:{
      '01':'开发笑出声的项目，考虑下',//开发
      '02': '好的设计项目找你，求安排',//设计
      '03': '求助运营大牛，江湖救急',//运营
      '04': '产品进，错过年终奖都不亏'//产品
    }
  },

  onShareAppMessage: function (res) {
    let detail = this.data.detail
    if(!detail)return
    return {
      title: this.data.shareTitles[detail.projectType]
    }
  },

  onLoad: function (options) {
    if (options&&options.no){
      this.setData({
        no: options.no
      })
    }
    this.getDetail()
  },

  onPullDownRefresh:function(){
    this.getDetail()
  },

  refresh:function(){
    this.getDetail()
  },

  viewFile:function(e){
    let data = e.currentTarget.dataset

    if(/\.txt/.test(data.url)){
      wx.showModal({
        title: '提示',
        content: '小程序暂不支持该格式文件预览',
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    let docTemps = this.data.docTemps
    let index = data.index
    let doc = docTemps[index]

    if(!doc){
      wx.showLoading({
        title: '下载文档中',
      })
      let url = data.url.replace('http:','https:')
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

  getDetail: async function (){
    let projectNo=this.data.no
    let res = await app.request.post('/project/projectInfo/detail', {
      projectNo: projectNo
    })
    if(res.code===0){

      const data=res.data
      let user = wx.getStorageSync('user')
      if (user) {

        if (data.projectState == 4) {
          this.getApplyInfo(data.id,user.userId)
        }

        let isMyProject= user.userId == data.publisher
        this.setData({
          isMyProject: isMyProject
        })
        if (isMyProject && data.applyNum > 0) {
          this.getApplyUsers(data.id)
        }
      }

      data.createTime = data.createTime.slice(0, -3)

      this.setData({
        detail: data
      })

      let imgs, docs
      if (data.fileBatchNo){
        let files = data.filesArr
        imgs = files.filter(item=>{
          return /(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/.test(item.url)
        })
        docs = files.filter(item => {
          return /(\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.pdf|\.txt)/.test(item.url)
        })

        this.setData({
          imgs: imgs,
          docs: docs
        })
      }
    }
  },

  getApplyInfo: async function (pid,uid) {
    let res = await app.request.post('/project/projectApply/detail', {
      projectId: pid,
      userId: uid
    })
    if (res.code !== 0) return
    this.setData({
      applyInfo: res.data
    })
  },

  getApplyUsers: async function (id){
    let res = await app.request.post('/project/projectRelation/getApplyList', {
      pageSize: 3,
      projectId: id
    })
    if (res.code !== 0) return
    this.setData({
      applyUsers:res.data
    })
  },

  apply:async function(){
    if(!app.checkLogin())return
    
    let res = await app.request.post('/user/userAuth/getUserBaseInfo', {})
    if (res.code !== 0) return

    let state = res.data.userState
    app.globalData.userInfo = res.data
    
    switch (state){
      case 0://未完善
        wx.showModal({
          title: '提示',
          content: '去完善个人主页并提交通过审核后，再来申请项目吧！',
          confirmText:'马上去',
          success:res=>{
            if(res.cancel)return
            wx.navigateTo({
              url:'/pages/mine/personalInfo/index/index',
            })
          }
        })
        break;
      case 1://审核中
        wx.showModal({
          title: '提示',
          content: '您已提交个人主页通过审核后即可申请项目',
          showCancel: false,
          confirmText: '知道了'
        })
        break;
      case 3://审核不通过
        wx.showModal({
          title: '提示',
          content: '您的个人主页未审核通过，请重新修改后提交审核',
          confirmText: '马上去',
          success: res => {
            if (res.cancel) return
            wx.navigateTo({
              url: '/pages/mine/personalInfo/index/index',
            })
          }
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/pages/project/apply/index/index?id=${this.data.detail.id}&&budget=${this.data.detail.projectBudgetCn}`,
        })
        break;
    }
  }
})