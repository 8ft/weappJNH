// components/tabs/tabs.js
Component({
  ready: function () {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation
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
    currentTarget:'tab0',
    animationData:null
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
      const query = wx.createSelectorQuery().in(this)
      query.select(`#${id}`).fields({
        size: true,
        rect:true
      }, (res) => {
        let width = res.width / 2
        this.setData({
          currentTarget:id,
          animationData: this.animation.width(width).translateX(res.left + width/2).step().export()
        })
      }).exec()
    }
  }
})
