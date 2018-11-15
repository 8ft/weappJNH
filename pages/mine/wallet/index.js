// pages/mine/wallet/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wallet:null,
    records:[],
    pageIndex:1,
    nomore:false
  },

  onLoad: function (options) {
    this.getWallet()
    this.getRecords()
  },

  onReachBottom: function () {
    this.getRecords()
  },

  getWallet:async function(){
    let res = await app.request.post('/user/payFund/myPayFund')
    if (res.code !== 0) return

    this.setData({
      wallet: res.data
    })
  },

  getRecords:async function(){
    if(this.data.nomore)return
    let res = await app.request.post('/order/payOrder/myOrders',{
      pageIndex:this.data.pageIndex,
      fundFlag:1
    })
    if (res.code !== 0) return

    if(res.page===res.pageIndex){
      this.setData({
        nomore:true
      })
    }else{
      this.setData({
        pageIndex:this.data.pageIndex++,
        records: this.data.records.concat(res.data.list)
      })
    }
  },

  download:function(){
    app.download()
  }
})