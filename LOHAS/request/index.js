const baseUrl = "https://www.lohas.ink/api";
import Toast from '../dist/toast/toast';

let ajaxTimes = 0;
export const request = (params) => {
  ajaxTimes += 1;
  // 显示加载中 效果
  wx.showLoading({
    title:"加载中...",
    mask:true
  });

  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes -= 1;
        // 关闭正在等待的图标
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
      }
    });
  })
}