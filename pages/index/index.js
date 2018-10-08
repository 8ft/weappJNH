//index.js
//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../libs/regenerator-runtime.js')

Page({
  data: {
   types:['全部'],
   curPage:0,
   pages:[{
     id:'',
     name:'全部',
     scrollTop: 0,
     pageIndex: 1,
     pageSize: 10,
     data:[]
   }],
   scrollTop:0,
   swiperHeight:0,
   fixTab:false
  },
  onLoad:async function () {
    await this.getProjectTypes()
    await this.getProjects()

    wx.createSelectorQuery().select('#banner').fields({
      size: true
    }, (res) => {
      this.setData({
        swiperHeight: res.height
      })
    }).exec()
  },
  onPageScroll:function(obj){
    this.setData({
      scrollTop: obj.scrollTop
    })
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
    let page = this.data.pages[this.data.curPage]
    page.pageIndex=1
    page.scrollTop=0
    page.data=[]
    
    this.setData({
      pages:this.data.pages
    })
    this.getProjects()
  },
  onReachBottom:function(){
    this.getProjects()
  },
  getProjectTypes:async function(){
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'project_type', 
      resultType: '1'
    })
    let list=res.data[0].dictList
    let types = list.map((item) => {
      return item.dictName
    })
    let pages=list.map((item)=>{
      return {
        id:item.dictValue,
        name:item.dictName,
        scrollTop:0,
        pageIndex: 1,
        pageSize: 10,
        data:[]
      }
    })
    
    this.setData({
      types: this.data.types.concat(types),
      pages: this.data.pages.concat(pages)
    })
  },
  getProjects: async function (){
    let page=this.data.pages[this.data.curPage]
    let res = await app.request.post('/project/projectInfo/getList',{
      pageIndex:page.pageIndex,
      pageSize:page.pageSize,
      projectType:page.id
    })

    let list = res.list.map((project) => {
      project.projectSkill = project.projectSkill.split('|')
      return project
    })

    page.data=page.data.concat(list)
    page.pageIndex +=1
    
    this.setData({
      pages: this.data.pages
    })

    wx.stopPullDownRefresh()
  },
  onTabChange:function(e){
    let index = e.detail.index
    this.data.pages[this.data.curPage].scrollTop=this.data.scrollTop
    this.setData({
      curPage: index,
      pages:this.data.pages
    })
    if (this.data.pages[index].data.length===0){
      this.getProjects()
    }else{
      wx.pageScrollTo({
        scrollTop: this.data.pages[index].scrollTop,
        duration:0
      })
    }
  }
})
