// components/tabs/tabs.js
Component({
  ready:function(){
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation;

    const query = wx.createSelectorQuery().in(this)
    this.setData({
      query: query
    })
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
    query:null,
    currentTarget:'tab0',
    animationData:{}
  },
  methods: {
    tabClick: function (e) {
      this.selectTab(e.currentTarget.id)
    },
    selectTab:function(id){
      this.data.query.select(`#${id}`).fields({
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
