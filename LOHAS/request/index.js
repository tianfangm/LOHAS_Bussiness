const baseUrl = "https://www.lohas.ink/api";
export const request=(params)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}

export const uploadFile=(params)=>{
  return new Promise((resolve,reject)=>{
    wx.uploadFile({
      ...params,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}

export const chooseImage=(params)=>{
  return new Promise((resolve,reject)=>{
    wx.chooseImage({
      ...params,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}
