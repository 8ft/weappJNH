//app.js
const request = require('./api/request.js')
const util = require('./utils/util.js')

App({
  globalData: {
    userInfo:null,
    editUserInfoCache:{
      jobTypes:null,
      detail: {
        content: ''
      }
    },
    publishDataCache:{
      skills:null,
      needSkills:[],
      needSkillsCn:[],
      desc:{
        content:''
      }
    }
  },
  request: request,
  util:util,
  checkLogin: () => {
    let user = wx.getStorageSync('user')
    if (!user || user.expired) {
      wx.navigateTo({
        url: '/pages/user/wxLogin/index',
      })
    }else{
      return true
    }
  },
  refreshPages: scene => {//刷新相关页面
    let pages=[]
    switch (scene){
      case 'login':
        pages = ['pages/project/detail/index', 'pages/project/projects/index']
        break;
      case 'applied'://申请项目
        pages = ['pages/project/index/index', 'pages/project/detail/index', 'pages/project/projects/index']
        break;
      case 'updatePersonalInfo':
        pages = ['pages/mine/personalInfo/index']
        break;
    }

    const currentPages = getCurrentPages()
    currentPages.forEach(page => {
      if (pages.indexOf(page.route) > -1) {
        page.refresh()
      }
    })
  }
})