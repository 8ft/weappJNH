//index.js
//获取应用实例
const app = getApp()
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')

Page({
  data: {
   pageIndex:1,
   pageSize:10,
   projects:[],
   skills:[],
   swiperHeight:0,
   fixTab:false
  },
  onLoad: function () {
    this.getProjects()
    wx.createSelectorQuery().select('#banner').fields({
      size: true
    }, (res) => {
      this.setData({
        swiperHeight: res.height
      })
    }).exec()
  },
  onPageScroll:function(obj){
    if(obj.scrollTop>=this.data.swiperHeight){
      this.setData({
        fixTab: true
      })
    }else{
      this.setData({
        fixTab: false
      })
    }
  },
  onPullDownRefresh:function(){
    this.setData({
      pageIndex:0,
      projects:[],
      skills:[]
    })
    this.getProjects()
  },
  onReachBottom:function(){
    this.getProjects()
  },
  getProjects: async function(){
    let res = await app.request.post('/project/projectInfo/getList',{
      pageIndex:this.data.pageIndex,
      pageSize:this.data.pageSize
    })
    this.setData({
      pageIndex:this.data.pageIndex+1,
      projects:this.data.projects.concat(res.list),
      skills:this.getSkillArr(res.list)
    })
    wx.stopPullDownRefresh()
  },
  getSkillArr:function(list){
   let arr=[]
   for(let i=0;i<list.length;i++){
     arr.push(list[i].projectSkill.split('|'))
   }
    arr=this.data.skills.concat(arr)
    return arr
  }
})
