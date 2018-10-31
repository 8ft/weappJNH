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
      let val = e.detail.value.replace(/[\s\r\n]/g, "")
      let disable=this.data.disable

      let isQQ = /^[1-9][0-9]{4,19}$/
      let isWechat = /([-_a-zA-Z0-9]{6,19})+$/

      switch (inputType) {
        case 'qq':
          this.setData({
            qq: val
          })
          if (val === '') {
            disable = ! isWechat.test(this.data.wechat)
          } else {
            let wechat=this.data.wechat
            disable = !(isQQ.test(val) && (wechat?isWechat.test(wechat):true))
          }
          break;
        case 'wechat':
          this.setData({
            wechat: val
          })
          if(val===''){
            disable = !isQQ.test(this.data.qq)
          }else{
            let qq=this.data.qq
            disable = !(isWechat.test(val) && (qq ? isQQ.test(qq) : true))
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
      if (res.code !==0) return
      this.setData({
        qq: '',
        wechat: '',
        disable: true
      })
      this.hide()
    },

    hide: function () {
      this.triggerEvent('hide')
      this.setData({
        show: false
      })
    }
  }
})
