// pages/mine/personalInfo/base/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../../libs/regenerator-runtime.js')

Page({
  data: {
    userBaseInfo:null,
    dicts:[],
    joinIndex:0,
    sexIndex:0,
    expIndex:0
  },

  onLoad: function (options) {
    this.getDicts()
  },

  onShow: function () {
    this.setData({
      userBaseInfo: app.globalData.userInfo.userBaseInfo
    })
  },

  getDicts: async function () {
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'sex_type|join_type|job_type|work_experience',
      resultType: '1'
    })

    if (res.code === 0) {
      this.setData({
        dicts: this.data.dicts.concat(res.data.data)
      })
      this.saveJobTypes()
    }
  },

  saveJobTypes: function () {
    let types = this.data.dicts[2].dictList,
      curTypes = app.globalData.userInfo.userBaseInfo.positionType.split('|')
    
    for(let i=0;i<types.length;i++){
      types[i].dictList = types[i].dictList.map(item => {
        if (curTypes.indexOf(item.dictValue) > -1) {
          item.selected = true
        }
        return item
      })
    }
    app.globalData.editUserInfoCache.jobTypes=types    
  },

  select: function (e) {
    let index = e.detail.value
    let type = e.currentTarget.dataset.type
    let data = this.data.userBaseInfo

    switch (type) {
      case 'join':
        data.settleType = this.data.dicts[1].dictList[index].dictValue
        data.settleTypeCn = this.data.dicts[1].dictList[index].dictName
        this.setData({
          userBaseInfo:data,
          joinIndex:index
        })
        break;
      case 'sex':
        data.sex = this.data.dicts[0].dictList[index].dictValue
        data.sexCn = this.data.dicts[0].dictList[index].dictName
        this.setData({
          userBaseInfo: data,
          sexIndex: index
        })
        break;
      case 'exp':
        data.workExperience = this.data.dicts[3].dictList[index].dictValue
        data.workExperienceCn = this.data.dicts[3].dictList[index].dictName
        this.setData({
          userBaseInfo: data,
          expIndex: index
        })
        break;
    }
    app.globalData.userInfo.userBaseInfo = this.data.userBaseInfo
  },

  input: function (e) {
    let inputType = e.currentTarget.dataset.type
    let val = e.detail.value.replace(/[ ]/g, "").replace(/[\r\n]/g, "")
    switch (inputType) {
      case 'nickName':
        this.data.userBaseInfo.nickName=val
        break;
      case 'positionTitle':
        this.data.userBaseInfo.positionTitle = val
        break;
      case 'daySalary':
        this.data.userBaseInfo.daySalary = val
        break;
    }
    this.setData({
      userBaseInfo: this.data.userBaseInfo
    })
    app.globalData.userInfo.userBaseInfo=this.data.userBaseInfo
  },

  save:async function(){
    let data=this.data.userBaseInfo
    let dicts=this.data.dicts
    let res = await app.request.post('/user/userAuth/completeUserBaseInfo', {
      nickName: data.nickName,
      settleType: data.settleType||dicts[1].dictList[0].dictValue,
      positionTitle:data.positionTitle,
      positionType:data.positionType,
      workExperience: data.workExperience || dicts[3].dictList[0].dictValue,
      daySalary:data.daySalary,
      city:data.city,
      sex: data.sex || dicts[0].dictList[0].dictValue
    })
    if(res.code===0){
      wx.navigateBack()
    }
  }

})