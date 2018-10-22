// pages/mine/personalInfo/base/city/index.js

//获取应用实例
const app = getApp()
//引入async await依赖库
const regeneratorRuntime = require('../../../../../libs/regenerator-runtime.js')
const getLetter = require('../../../../../utils/pinyin.js')

Page({
  data: {
    cities:null
  },

  onLoad: function (options) {
    let cities = app.globalData.cities
    if (cities){
      this.setData({
        cities: cities
      })
    }else{
      this.getCity()
    }
  },

  select:function(e){
    let city = e.currentTarget.dataset.city
    app.globalData.userInfo.userBaseInfo.city = city.zoneCode
    app.globalData.userInfo.userBaseInfo.cityCn = city.zoneName
    wx.navigateBack()
  },

  getCity:async function(){
    let res = await app.request.post('/dict/dictZone/getList', {})
    if (res.code !== 0) return
    this.updateCityList(res.data.data)
  },

  updateCityList(cityList) {
    let hotCitys = cityList.filter((item, index, array) => {
      return item.zoneLevel === 1
    })

    let letterList = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('')
    let cities= {
      hot:hotCitys,
      list:{}
    }

    letterList.map(letter => {
      cities.list[letter] = []
    })
    cityList.map(city => {
      cities.list[getLetter(city.zoneName[0])[0]].push(city)
    })

    this.setData({
      cities:cities
    })
    app.globalData.cities=cities
  }

})