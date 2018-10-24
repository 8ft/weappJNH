// pages/project/apply/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    id:'',
    budget:'',
    price:'',
    desc: '',
    conLen: 0,
    inputLen: -1,
    disagree:false
  },

  onLoad: function (options) {
    this.setData({
      id:options.id,
      budget: options.budget
    })
  },

  input: function (e) {
    let inputType = e.currentTarget.dataset.type
    let val = e.detail.value.replace(/[ ]/g, "").replace(/[\r\n]/g, "")
    switch (inputType) {
      case 'price':
        this.setData({
          price: val
        })
        break;
      case 'desc':
        let conLen = val.length,
          inputLen
        if (conLen === 100) {
          inputLen = 100
        } else {
          inputLen = -1
        }
        this.setData({
          desc: e.detail.value,
          conLen: conLen,
          inputLen: inputLen
        })
        break;
    }
  },

  setAgree:function(){
    this.setData({
      disagree:!this.data.disagree
    })
  },

  send: async function () {
    if (!app.checkLogin()) return 
    let data = this.data
    if (!data.price) {
      wx.showToast({
        title: '请输入您的报价',
        icon: 'none'
      })
      return
    }
    if (!data.desc) {
      wx.showToast({
        title: '请输入申请说明',
        icon: 'none'
      })
      return
    }

    let res = await app.request.post('/project/projectApply/save', {
      projectId: data.id,
      applyDesc: data.desc,
      projectOffer: data.price
    })
    if (res.code === 0) {
      wx.showToast({
        title: '发送成功',
        icon: 'none'
      })
      // wx.navigateBack()
    }
  }
})