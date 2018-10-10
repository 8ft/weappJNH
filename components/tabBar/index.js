// components/tabBar/tabBar.js
Component({
  created:function(){
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation=animation;
  },

  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    animated:false,
    animationData:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    animate:function(){
      let data
      if (this.data.animated){
        data=this.animation.rotate(0).step().export()
      }else{
        data=this.animation.rotate(45).step().export()
      }
      
      this.setData({
        animated: !this.data.animated,
        animationData: data
      })
    }
  }
})
