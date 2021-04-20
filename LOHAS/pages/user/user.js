// pages/user/user.js

import {
  request
} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import {
  showToast,
  uploadFile,
  chooseImage
} from '../../utils/asyncWx.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_type: false,
    userinfo: {
      avatar: "",
      head_picture: "",
      shop_address: "",
      shop_business_hours: "",
      shop_intro: "",
      shop_latitude: 0,
      shop_lohas_info: "",
      shop_longitude: 0,
      shop_name: "",
      shop_type: ""
    },
    isLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async imageClick() {
    try {
      var that = this;
      const res = await chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
      });
      if (res) {
        const res1 = await uploadFile({
          url: "/pic/upload",
          method: "POST",
          name: "file",
          filePath: res.tempFilePaths[0],
          formData: {
            "file": "file"
          }
        });
        var obj = JSON.parse(res1.data);
        console.log(this.data.userinfo)
        if (obj.status === "done") {
          this.data.userinfo.avatar = obj.pic_url;
          console.log(this.data.userinfo.avatar)
          const res2 = await request({
            url: "/shopinfo/update",
            method: "POST",
            data: this.data.userinfo,
            header: {
              "content-type": "application/json",
              "token": wx.getStorageSync('token')
            }
          });
          if (res2.data.state) {
            console.log("修改头像成功！！！");
            wx.removeStorageSync('userInfo');
            wx.setStorageSync('userInfo', this.data.userinfo);
          }
        } else {
          console.log("修改失败");
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  async backgroundClick() {
    try {
      var that = this;
      const res = await chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
      });
      if (res) {
        const res1 = await uploadFile({
          url: "/pic/upload",
          method: "POST",
          name: "file",
          filePath: res.tempFilePaths[0],
          formData: {
            "file": "file"
          }
        });
        var obj = JSON.parse(res1.data);

        if (obj.status === "done") {
          this.data.userinfo.head_picture = obj.pic_url;
          const res2 = await request({
            url: "/shopinfo/update",
            method: "POST",
            data: this.data.userinfo,
            header: {
              "content-type": "application/json",
              "token": wx.getStorageSync('token')
            }
          });
          if (res2.data.state) {
            console.log("修改背景成功！！！");
            wx.removeStorageSync('userInfo');
            wx.setStorageSync('userInfo', this.data.userinfo);
          }
        } else {
          console.log("修改失败");
        }
      }
    } catch (error) {
      console.log(error);
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
    const userinfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        isLogin: true
      });
    }
    if (userinfo.shop_name) {
      console.log(userinfo.shop_name)
      this.setData({
        userinfo: userinfo
      });
    }
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

  jumpPage() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  async onSuggestionClick(){
    const res = await showToast({
      title: '功能即将上线！',
      icon: 'success',
      duration: 1000
    })
  }
})