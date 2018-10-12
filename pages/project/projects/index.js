// pages/index/projects/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectType:'',
    priceBudget:'',
    projectCycle:'',
    pageIndex: 1,
    projects: [],
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProjects()
  },

  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 1,
      projects: [],
      nomore:false
    })
    this.getProjects()
  },

  onReachBottom: function () {
    this.getProjects()
  },

  getProjects: async function () {
    let nomore = this.data.nomore
    if (nomore) return

    let pIndex = this.data.pageIndex
    let res = await app.request.post('/project/projectInfo/getList', {
      pageIndex: pIndex,
      pageSize: 10
    })
    let list = res.list.map((project) => {
      project.projectSkill = project.projectSkill.split('|')
      return project
    })

    if (res.page > pIndex) {
      pIndex++
    } else {
      nomore = true
    }

    this.setData({
      projects: this.data.projects.concat(list),
      pageIndex: pIndex,
      nomore: nomore
    })

    wx.stopPullDownRefresh()
  }
})