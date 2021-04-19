/**
 * promise 形式 showModal
 */
const baseUrl = "https://www.lohas.ink/api";
export const showModal = (params)=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      ...params, 
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}

/**
 * promise 形式 uploadFile
 */
export const uploadFile = (params) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete:()=>{
      }
    });
  })
}

/**
 * promise 形式 chooseImage
 */
export const chooseImage = (params) => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      ...params,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

export const showToast = (params) =>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      ...params
    })
  })
}