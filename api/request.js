const host ='https://api.dev.juniuhui.com' //测试环境
// const host = 'https://api.juniuhui.com' //正式环境
const requestArr=[]

const request =(url, options) => {
  if (requestArr.length === 0) { 
    wx.showLoading()
  }
  requestArr.push(1)

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${host}${url}`,
      method: options.method,
      data: options.data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'client_type':'30',
        'api_version':'1.0.0000',
        'token': wx.getStorageSync('user').token||''
      },
      success(res) {
        requestArr.pop()
        if (requestArr.length===0){
          wx.hideLoading()
        }

        if(res.statusCode!==200){
          wx.showModal({
            title: '请求异常',
            content: `${res.statusCode}` ,
            showCancel: false,
            confirmText: '好的'
          })
          reject()
        }else{
          if (res.data.code !== 0) {
            wx.showModal({
              title: '提示',
              content: `${res.data.message}`,
              showCancel: false,
              confirmText: '好的'
            })
          }
          resolve(res.data)
        }
      },
      fail(error) {
        requestArr.pop()
        if (requestArr.length === 0) {
          wx.hideLoading()
        }

        wx.showModal({
          title: '请求异常',
          content: error.errMsg,
          showCancel: false,
          confirmText: '好的'
        })
        reject()
      }
    })

  })
}

const get = (url, options = {}) => {
  return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}

module.exports = {
  get,
  post
}