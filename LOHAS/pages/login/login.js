// pages/login/login.js
import{request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    password:"",
    token:"",
    response:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async login(){
    try{
      const res = await request({
        url : "/shop/login",
        method : "POST",
        data:{
          password:wx.getStorageSync('password'),
          username:wx.getStorageSync('username'),
        },
        header:{
          "content-type":"application/json"
        }
      });
      if(res.data.state){
        wx.setStorageSync('token', res.header.token);
        this.getUserInfo();
        wx.switchTab({
          url: '../../pages/store/store',
        })
      }
      else{
        console.log("登录失败");
      }
    }
    catch(error){
      console.log(error);
    }
  },


  // 获取用户名
  getUserName:function(e){
    var value=e.detail.value;
    this.setData({
      username:value,
    });
    wx.setStorageSync('username', value);
  },

  // 获取密码
  getPassword:function(e){
    var value=e.detail.value;
    this.setData({
      password:value,
    });
    wx.setStorageSync('password', value);
  },

  // 获取商店信息
  async getUserInfo(){
    const res = await request({
      url:"/shopinfo/getmine",
      header:{
        "content-type":"application/json",
        "token":wx.getStorageSync('token')
      }
    });
    if(res.statusCode===200){
      wx-wx.setStorageSync('userInfo', res.data);
      console.log(res.data);
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
})