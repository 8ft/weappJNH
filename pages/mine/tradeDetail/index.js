// pages/mine/tradeDetail/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  data: {
    detail:null
  },

  onLoad: function (options) {
    this.getDetail(options.id)
  },

  getDetail:async function(oid){
    let res = await app.request.post('/order/payOrder/detail',{
      orderId: oid
    })
    if (res.code !== 0) return

    this.setData({
      wallet: res.data
    })
  }
})