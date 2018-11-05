//app.js
const request = require('./api/request.js')
const util = require('./utils/util.js')

App({
  request: request,
  util: util,

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

  checkLogin: () => {
    let user = wx.getStorageSync('user')
    if (!user || user.expired) {
      wx.navigateTo({
        url: '/pages/user/wxLogin/index',
      })
    } else {
      return true
    }
  },
  
  activeTabbarPages: [],
  addActiveTabbarPage: function() {
    const currentPages = getCurrentPages()
    let currentPage = currentPages[0]

    let activeTabbarPages = this.activeTabbarPages
    if (!activeTabbarPages.some(page => {
      return page.route === currentPage.route
    })) {
      this.activeTabbarPages.push(currentPage)
    }
  },

  delActiveTabbarPage: function () {
    const currentPages = getCurrentPages()
    let currentPage = currentPages[0]

    this.activeTabbarPages=this.activeTabbarPages.filter(page => {
      if(page.route!==currentPage.route){
        return page
      }
    })
  },

  refreshPages:function(scene) {//刷新相关页面
    let pages=[],
      tabbarPages=[]

    switch (scene){
      case 'login':
        pages = ['pages/project/detail/index', 'pages/project/projects/index']
        tabbarPages = ['pages/project/index/index']
        break;
      case 'logout':
        tabbarPages = ['pages/project/index/index', 'pages/project/publish/index']
        break;
      case 'applied'://申请项目
        pages = ['pages/project/detail/index', 'pages/project/projects/index']
        tabbarPages = ['pages/project/index/index']
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

    this.activeTabbarPages.forEach(page => {
      if (tabbarPages.indexOf(page.route) > -1) {
        page.refresh()
      }
    })

  }
})