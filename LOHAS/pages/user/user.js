// pages/user/user.js

import{request,uploadFile,chooseImage} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userinfo = wx.getStorageSync('userInfo');
    this.setData({userinfo})
  },

  async imageClick(){
    var that = this;
    const res = await chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
    });
    if(res){
      const res1 = await uploadFile({
        url:"/pic/upload",
        method:"POST",
        name:"file",
        filePath:res.tempFilePaths[0],
        formData:{
          "file":"file"
        }
      });
      var obj = JSON.parse(res1.data);

      if(obj.status==="done"){
        this.data.userinfo.avatar = obj.pic_url;
        console.log(this.data.userinfo.avatar)
        const res2=await request({
          url:"/shopinfo/update",
          method : "POST",
          data:this.data.userinfo,
          header:{
            "content-type": "application/json",
            "token": wx.getStorageSync('token')
          }
        });
        if(res2.data.state){
          console.log("修改头像成功！！！");
          wx.removeStorageSync('userInfo');
          wx.setStorageSync('userInfo', this.data.userinfo);
        }
      }
      else{
        console.log("修改失败");
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  jumpPage(){
    wx.navigateTo({
      url: '../login/login',
    })
  }
})