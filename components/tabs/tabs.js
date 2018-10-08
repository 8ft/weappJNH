// components/tabs/tabs.js
Component({
  ready: function () {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation

    const query = wx.createSelectorQuery().in(this)
    this.query = query

    this.selectTab('tab0')
  },
  properties: {
    tabs: Array,
    fixed:{
      type:Boolean,
      value:false
    }
  },
  data: {
    currentTarget:'',
    animationData:{}
  },
  methods: {
    tabClick: function (e) {
      let tabId = e.currentTarget.id
      if(tabId!==this.data.currentTarget){
        this.selectTab(tabId)
        this.triggerEvent('change', { index: parseInt(tabId.split('tab')[1]) })
      }
    },
    selectTab:function(id){
      this.query.select(`#${id}`).fields({
        size: true,
        rect:true
      }, (res) => {
        this.setData({
          currentTarget:id,
          animationData: this.animation.width(res.width).translate(res.left).step().export()
        })
      }).exec()
    }
  }
})
