// pages/mine/personalInfo/works/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../../libs/regenerator-runtime.js')

Page({

  data: {
    dicts:null,
    name:'',
    type:'',
    industryIndex:0,
    url:'',
    desc:'',
    image:'',
    conLen:0,
    inputLen:-1,
    batchNo:'',
    id:''
  },

  onLoad: function (options) {
    let index = options.index
    if (index){
      let data = app.globalData.userInfo.userSampleInfos[index]

      let desc = data.sampleDesc,
        conLen = desc.replace(/(^[\s\r\n]*)|([\s\r\n]*$)/g, "").length,
        inputLen

      if (conLen === 100) {
        inputLen = 100
      } else {
        inputLen = -1
      }

      this.setData({
        name: data.sampleName,
        type: data.tradeType,
        url: data.sampleUrl,
        desc:desc,
        image: data.sampleImage,
        conLen: conLen,
        inputLen: inputLen,
        batchNo: data.sampleImageBatchNo,
        id:data.id
      })
    }
    this.getDicts()
  },

  getDicts: async function () {
    let res = await app.request.post('/dict/dictCommon/getDicts', {
      dictType: 'industry_type',
      resultType: '1'
    })

    if (res.code === 0) {
      let dicts = res.data.data[0].dictList
      this.setData({
        dicts: dicts,
        type: dicts[0].dictName
      })
    }
  },

  select: function (e) {
    let index = e.detail.value
    this.setData({
      industryIndex: index,
      type:this.data.dicts[index].dictName
    })
  },

  input: function (e) {
    let inputType = e.currentTarget.dataset.type
    let val = e.detail.value.replace(/[ ]/g, "").replace(/[\r\n]/g, "")
    switch (inputType) {
      case 'name':
        this.setData({
          name:val
        })
        break;
      case 'url':
        this.setData({
          url: val
        })
        break;
      case 'desc':
        let input = e.detail.value
        let validInput = input.replace(/(^[\s\r\n]*)|([\s\r\n]*$)/g, "")
        let conLen = validInput.length

        if (conLen > 100) {
          input = input.slice(0, 100)
          validInput = input.replace(/(^[\s\r\n]*)|([\s\r\n]*$)/g, "")
          conLen = validInput.length
        }

        let inputLen
        if (conLen === 100) {
          inputLen = 100
        } else if (conLen < 100) {
          inputLen = -1
        }
        
        this.setData({
          desc: input,
          conLen: conLen,
          inputLen: inputLen
        })
        break;
    }
  },

  chooseImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.uploadImage(res.tempFilePaths[0])
      }
    })
  },

  uploadImage: function (path) {
    wx.uploadFile({
      url: 'https://api.dev.juniuhui.com/public/file/upload',
      filePath: path,
      name: 'file',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'client_type': '40',
        'api_version': '1.0.0000',
        'token': wx.getStorageSync('user').token || ''
      },
      formData: {
        category: '1107',
        multiple: '0'
      },
      success: res => {
        let data = JSON.parse(res.data)
        if (data.code === 0)
        this.setData({
          image:path,
          batchNo: data.data.batchNo
        })
      }
    })
  },

  save: async function () {
    let data=this.data
    if(!data.name){
      wx.showToast({
        title: '请输入作品名称',
        icon:'none'
      })
      return
    }
    if (!data.desc) {
      wx.showToast({
        title: '请输入作品描述',
        icon: 'none'
      })
      return
    }
    if (data.url&&!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(data.url)){
      wx.showToast({
        title: '作品链接有误，请以http://或者https://开头',
        icon: 'none'
      })
      return
    }

    let res = await app.request.post('/user/userAuth/completeUserSample', {
      sampleName: data.name,
      sampleDesc: data.desc.replace(/(^[\s\r\n]*)|([\s\r\n]*$)/g, ""),
      tradeType: data.dicts[data.industryIndex].dictValue,
      id:data.id,
      sampleImage: data.batchNo,
      sampleUrl: data.url
    })
    if (res.code === 0) {
      //刷新相关页面  
      let pages = getCurrentPages()
      pages.forEach(page => {
        if (page.route === 'pages/mine/personalInfo/index') {
          page.onLoad()
        }
      })
      wx.navigateBack()
    }
  }
 
})