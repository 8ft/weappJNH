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
    budgetIndex:0,
    cycleIndex:0,
    cooperaterIndex:0,
    typeIconName:{
      '开发':'kaifa',
      '设计':'sheji',
      '市场/运营':'yunying',
      '产品':'chanpin'
    },
    pName:'',
    cName:'',
    needsSkillsCn:'',
    desc:'',
    showCollector:false
  },
  
  onLoad: function (options) {
    app.checkLogin()
    this.getDicts()
  },

  onShow:function(){
    this.setData({
      needsSkillsCn: app.globalData.publishDataCache.needSkillsCn.join('|'),
      desc: app.globalData.publishDataCache.desc.content
    })
  },

  getDicts:async function(){
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'project_type|price_budget|project_cycle|cooperate_type',
      resultType: '1'
    })

    if(res.code===0){
      this.setData({
        dicts: this.data.dicts.concat(res.data.data)
      })
      this.saveSkillData()
    }
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
        this.saveSkillData()
        break;
      case 'subType':
        this.setData({
          subTypeIndex: index
        })
        this.saveSkillData()
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

  saveSkillData:function(){
    this.setData({
      needsSkillsCn:''
    })
    app.globalData.publishDataCache.needSkills=[]
    app.globalData.publishDataCache.needSkillsCn = []
    app.globalData.publishDataCache.skills = this.data.dicts[0].dictList[this.data.typeIndex].dictList[this.data.subTypeIndex].dictList
  },

  input: function (e) {
    let inputType = e.currentTarget.dataset.type
    let val = e.detail.value.replace(/[ ]/g, "").replace(/[\r\n]/g, "")
    switch (inputType) {
      case 'project':
        this.setData({
          pName: val
        })
        break;
      case 'company':
        this.setData({
          cName: val
        })
        break;
    }
  },

  publish:async function(){
    if(!app.checkLogin())return 

    if (this.data.desc.replace(/[ ]/g, "").replace(/[\r\n]/g, "").length<50){
      wx.showToast({
        title: '项目描述最少50字',
        icon: 'none'
      })
      return
    }

    let data=this.data
    let dicts = data.dicts 

    let res = await app.request.post('/project/projectInfo/save', {
      projectCycle: dicts[2].dictList[data.cycleIndex].dictValue,
      projectBudget: dicts[1].dictList[data.budgetIndex].dictValue,
      projectDesc: data.desc,
      projectSkill: app.globalData.publishDataCache.needSkills.join('|'),
      projectType: dicts[0].dictList[data.typeIndex].dictValue,
      projectSubtype: dicts[0].dictList[data.typeIndex].dictList[data.subTypeIndex].dictValue,
      cooperater: dicts[3].dictList[data.cooperaterIndex].dictValue,
      companyName: data.cName,
      projectName: data.pName
    })

    if (res.code === 0) {
      this.resetPage()
      this.setData({
        showCollector: true
      })
    }
  },

  resetPage:function(){
    this.setData({
      typeIndex: 0,
      subTypeIndex: 0,
      budgetIndex: 0,
      cycleIndex: 0,
      cooperaterIndex: 0,
      pName: '',
      cName: '',
      needsSkillsCn: '',
      desc: ''
    })

    app.globalData.publishDataCache = {
      skills: this.data.dicts[0].dictList[this.data.typeIndex].dictList[this.data.subTypeIndex].dictList,
      needSkills: [],
      needSkillsCn: [],
      desc: {
        content:''
      }
    }
  },

  hideCollector:function(){
    this.setData({
      showCollector:false
    })
  }

})