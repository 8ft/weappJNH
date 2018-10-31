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
    uid:'',
    detail:null,
    imgs:[],
    docs: [],
    docTemps:[],
    applyUsers:null
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

  viewFile:function(e){
    let data = e.currentTarget.dataset
    let index=data.index

    let docTemps = this.data.docTemps
    let doc = docTemps[index]

    if(!doc){
      wx.showLoading({
        title: '下载文档中',
      })
      let url = data.url.replace('http:','https:')
      console.log(url)
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
      if (res.data.publisher==this.data.uid&&res.data.applyNum>0){
        this.getApplyUsers(res.data.id)
      }

      let imgs, docs

      if (res.data.fileBatchNo){
        let files = res.data.filesArr
        imgs = files.filter(item=>{
          return /(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/.test(item.url)
        })
        docs = files.filter(item => {
          return /(\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx|\.pdf)/.test(item.url)
        })
      }
      
      this.setData({
        detail: res.data,
        imgs: imgs,
        docs:docs
      })
    }
  },

  getApplyUsers: async function (id){
    let res = await app.request.post('/project/projectRelation/getApplyList', {
      pageSize: 3,
      projectId: id
    })
    if (res.code === 0) {
      this.setData({
        applyUsers:res.data
      })
    }
  },

  apply:async function(){
    let state

    let res = await app.request.post('/user/userAuth/getUserBaseInfo', {})
    if (res.code !== 0) return
    app.globalData.userInfo = res.data
    state = res.data.userState
    
    switch (state){
      case 0://未完善
        wx.showModal({
          title: '提示',
          content: '去完善个人主页并提交通过审核后，再来申请项目吧！',
          confirmText:'马上去',
          success:res=>{
            if(res.cancel)return
            wx.navigateTo({
              url:'/pages/mine/personalInfo/index',
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
              url: '/pages/mine/personalInfo/index',
            })
          }
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/pages/project/apply/index?id=${this.data.detail.id}&&budget=${this.data.detail.projectBudgetCn}`,
        })
        break;
    }
  },

  download:function(){
    wx.showModal({
      title: '该功能正在开发中',
      content: '请前往应用市场搜索下载"巨牛汇APP"进行后续操作',
      showCancel:false,
      confirmText:'知道了'
    })
  }
})