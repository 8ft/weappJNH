module.exports = {
  host:'https://api.dev.juniuhui.com', //测试环境
  // host:'https://api.juniuhui.com', //正式环境

  contentType: 'application/x-www-form-urlencoded;charset=utf-8',
  clientType:'40',
  version: '1.0.0000',
  token: wx.getStorageSync('user').token || ''
}
