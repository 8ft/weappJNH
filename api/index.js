//引入async await依赖库
const regeneratorRuntime = require('../libs/regenerator-runtime.js')
const request = require('request.js')

const login = async ()=>{
  let openId = wx.getStorageSync('openId')
  if (!openId) {
      wx.login({
        success: async res => {
          let data = await request.get('/weixin/mini/getOpenId', {
            code: res.code
          })
          wx.setStorageSync('openId', data.openid)
          saveUserData(data.openid)
        }
      })
    }else{
      saveUserData(openId)
    }
}

const saveUserData=async id =>{
  let res = await request.post('/user/userThirdpartInfo/login', {
    thirdpartIdentifier: id,
    type: 0
  })

  let code = res.code

  if (code=== 0) {
    wx.setStorageSync('user', res.data)
    wx.navigateBack()
  } else if (code===507){
    wx.redirectTo({
      url: '/pages/user/bind/index',
    })
  }
}

module.exports = {
  login
}