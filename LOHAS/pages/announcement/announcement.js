// pages/announcement/announcement.js
import{request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 公告列表
    shop_announcements:[]
  },
  // 接口要的参数
  QueryParams:{
    page_num:1,
    page_size:10,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAnnouncementList();
  },

  // 获取公告列表
  async getAnnouncementList(){
    const Announcements = wx.getStorageSync('announcement');
    if(!Announcements){
      // 不存在 发送请求获取数据
      this.getAnnouncement();
    }
    else{
      // 有旧的数据 判断过期时间
      if(Date.now()-Announcements.time>1000*10){
        // 重新发送请求
        this.getAnnouncement();
      }
      else{
        // 可以使用旧数据
        this.setData({
          shop_announcements:Announcements
        });
      }
    }
  },

  // 获取数据
  async getAnnouncement(){
    try{
      const res = await request({
        url:"/announcement/getmine",
        method:"POST",
        data:this.QueryParams,
        header:{
          "content-type":"application/json",
          "token":wx.getStorageSync('token')
        }
      });
      if(res.statusCode==200){
        // 把接口数据存入本地缓存
        this.setData({
          shop_announcements:res.data.shop_announcements
        });
        wx-wx.setStorageSync('announcement', {time:Date.now(),date:this.shop_announcements});
      }
    }
    catch(error){
      console.log(error);
    }
  },

  // 删除公告
  async deleteAnnouncement(){
    try{
      const res = await request({
        url : "/announcement/delete",
        method : "POST",
        data:{
          "announcement_id": 0
        },
        header:{
          "content-type":"application/json",
          "token":wx.getStorageSync('token')
        }
      });
    }
    catch(error){
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

  /*
  * 页面跳转
  */
  jumpPage:function(){
    wx.navigateTo({
      url:'./releaseAnnouncement'
    })
  },

  /*
  * 滚动条触底事件
  */
 onReachBottom(){
  console.log("页面触底");
 }
})