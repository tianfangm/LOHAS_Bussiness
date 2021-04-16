import{request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
// pages/announcement/releaseAnnouncement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    content:"",
    title:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 发布公告
  async releaseAnnouncement(){
    try{
      const res = await request({
        url : "/announcement/create",
        method : "POST",
        data:{
          content:this.data.content,
          title:this.data.title
        },
        header:{
          "content-type":"application/json",
          "token":wx.getStorageSync('token')
        }
      });
      if(res.data.state){
        //发布成功
        console.log("发布成功！！！");
        wx.navigateBack({
          delta: 1,
        })
      }
    }
    catch(error){
      console.log(error);
    }
  },

  // 获取输入标题
  getTitle:function(e){
    var value=e.detail;
    this.setData({
      title:value,
    });
  },

  // 获取输入内容
  getContent:function(e){
    var value=e.detail;
    this.setData({
      content:value,
    });
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
  onPullDownRefresh() {
    
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

  }
})