//index.js
const app = getApp()
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const observer = require('../../../libs/observer').observer;

Page(observer({
  props: {
    stores: app.stores
  },

  data: {
    user:null,
    state:''
  },

  onShow:async function(){
    if (this.props.stores.account.logged_in){
     await this.getInfo()
    }else{
      this.setData({
        state:''
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: '接包发包专业平台',
      path: 'pages/project/index/index',
      imageUrl:'/assets/img/share.png'
    }
  },

  go:function(e){
    if (!app.checkLogin()) return 
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  getInfo: async function () {
    let res = await app.request.post('/user/userAuth/getUserBaseInfo')
    if (res.code !== 0) return
    let state=''
    switch(res.data.userState){
      case 0:
        state='请完善'
        break;
      case 1:
        state = '审核中'
        break;
      case 2:
        state = '审核通过'
        break;
      case 3:
        state = '审核未通过'
        break;
    }
    app.globalData.userInfo = res.data
    this.setData({
      user: res.data,
      state:state
    })
  },

  logout:function(){
    wx.showModal({
      title: '提示',
      content: '确定要退出吗',
      success: async res => {
        if (res.confirm) {
            this.props.stores.account.logout(app)
        }
      }
    })
  }
}))
