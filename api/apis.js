const host = 'https://api.dev.juniuhui.com' //测试环境
// const host = 'https://api.juniuhui.com' //正式环境

const uploadFile = (file,category,batch)=>{

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${host}/public/file/upload`,
      filePath: file.path,
      name: 'file',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'client_type': '30',
        'api_version': '1.0.0000',
        'token': wx.getStorageSync('user').token || ''
      },
      formData: {
        category: category,
        multiple: '1',
        batchNo:batch||''
      },
      success: res => {
        let data = JSON.parse(res.data)
        if(data.code===0){
          resolve(data.data.list[0])
        }else{
          reject(data.code)
        }
      }
    })

  })
}

const uploadFiles = (files, category, batch)=>{
  if(tooBig(files)){
    wx.showToast({
      title: '图片不能超过5M,请重新选择',
      icon:'none'
    })
    return
  }
  wx.showLoading()
  return new Promise((resolve, reject) => {
    let promises = []

    //如果没有批次号，先上传第一个获取批次号
    if(!batch){
      let results = []
      let batchCache = ''

      uploadFile(files[0], category, batch).then(firstFile=>{

        batchCache = firstFile.batchNo
        results.push(firstFile)

        //用第一个获取的批次号上传剩余文件
        files.map((file,index) => {
          if(index>0){
            promises.push(uploadFile(file, category, batchCache))
          }
        })

        Promise.all(promises).then(otherFiles => {
            resolve(results.concat(otherFiles))
          wx.hideLoading()
        }).catch((error) => {
          reject()
          wx.hideLoading()
        })
      })

    }else{
      //有批次号，直接上传
      files.map(file => {
        promises.push(uploadFile(file, category, batch))
      })

      Promise.all(promises).then(result => {
        resolve(result)
        wx.hideLoading()
      }).catch((error) => {
        reject()
        wx.hideLoading()
      })
    }

  })
}

const tooBig=files=>{
  return files.some(file=>{
    return file.size / 1024 / 1024 > 5
  })
}

  module.exports={
    uploadFiles
  }