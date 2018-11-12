// components/common/navigationBar/index.js
Component({
  externalClasses: ['navbar-reset'],

  properties: {

  },

  data: {
    top:0,
  },

  attached:function(){
    wx.getSystemInfo({
      success: res=>{
        this.setData({
          top: res.statusBarHeight
        })
      },
    })
  },

  methods: {

  }
})
