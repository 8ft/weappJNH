// pages/project/publish/index.js
//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({
  data: {
    dicts:[],
    typeIndex:0,
    subTypeIndex:0,
    skillIndex:0,
    budgetIndex:0,
    cycleIndex:0,
    cooperaterIndex:0,
    typeIconName:{
      '开发':'kaifa',
      '设计':'sheji',
      '市场/运营':'yunying',
      '产品':'chanpin'
    }
  },

  onLoad: function (options) {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
    this.getDicts()
  },

  getDicts:async function(){
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'project_type|price_budget|project_cycle|cooperate_type',
      resultType: '1'
    })

    this.setData({
      dicts: this.data.dicts.concat(res.data)
    })
  },

  select:function(e){
    let index
    let data=e.currentTarget.dataset
    if(e.type==='change'){
      index=e.detail.value
    }else{
      index=data.index
    }
    
    switch(data.type){
      case 'type':
        this.setData({
          typeIndex:index
        })
        break;
      case 'subType':
        this.setData({
          subTypeIndex: index
        })
        break;
      case 'skill':
        this.setData({
          skillIndex: index
        })
        break;
      case 'budget':
        this.setData({
          budgetIndex: index
        })
        break;
      case 'cycle':
        this.setData({
          cycleIndex: index
        })
        break;
      case 'cooperater':
        this.setData({
          cooperaterIndex: index
        })
        break;
    }
  },

  PriceChange:function(e){
    this.setData({
      priceIndex: e.detail.value
    })
  }
})