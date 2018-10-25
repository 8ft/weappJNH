// components/collector/contactInfo/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../libs/regenerator-runtime.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qq:'',
    wechat:'',
    disable:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    input: function (e) {
      let inputType = e.currentTarget.dataset.type
      let val = e.detail.value
      let disable=this.data.disable

      switch (inputType) {
        case 'qq':
          this.setData({
            qq: val
          })
          if (val === '') {
            disable = ! /[-_a-zA-Z0-9]{5,19}$/.test(this.data.wechat)
          } else {
            disable = !/^[1-9]\d{4,19}$/.test(val)
          }
          break;
        case 'wechat':
          this.setData({
            wechat: val
          })
          if(val===''){
            disable = !/^[1-9]\d{4,19}$/.test(this.data.qq)
          }else{
            disable = ! /[-_a-zA-Z0-9]{5,19}$/.test(val)
          }
          break;
      }

      this.setData({
        disable:disable
      })
    },

    save:async function(){
      let res = await app.request.post('/user/userAuth/completeUserContact', {
        qq: this.data.qq,
        wechat: this.data.wechat
      })
      if (res.code !==0) 
      this.hide()
      wx.navigateTo({
        url: '/pages/mine/personalInfo/index',
      })
    },

    hide: function () {
      this.triggerEvent('hide')
      this.setData({
        show: false
      })
    }


  }
})
