//index.js
const app = getApp()
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')
const observer = require('../../../libs/observer').observer;

Page(observer({
  props: {
    stores: require('../../../stores/index')
  },

  data: {
    hasLogin:false,
    user:null,
    state:''
  },

  onShow:async function(){
    console.log(this.props.stores.account.state)

    let user = wx.getStorageSync('user')
    let hasLogin = (!user || user.expired) ? false : true
    if (hasLogin){
     await this.getInfo()
    }else{
      this.setData({
        state:''
      })
    }
    this.setData({
      hasLogin: hasLogin
    })
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
          let res = await app.request.post('/user/userAuth/logout', {})
          if (res.code === 0) {

            app.globalData = {
              userInfo: null,
              editUserInfoCache: {
                jobTypes: null,
                detail: {
                  content: ''
                }
              },
              publishDataCache: {
                skills: null,
                needSkills: [],
                needSkillsCn: [],
                desc: {
                  content: ''
                }
              }
            }
            wx.clearStorageSync()
            wx.reLaunch({
              url: '/pages/mine/index/index'
            })
          }
        }
      }
    })
  }
}))
