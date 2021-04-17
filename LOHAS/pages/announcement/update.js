// pages/announcement/update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取输入标题
  getTitle:function(e){
    this.QueryParams.title=e.detail;
  },

  // 获取输入内容
  getContent:function(e){
    this.QueryParams.context=e.detail;

  },

  // 修改公告
  async updateAnnouncement(){
    console.log(this.QueryParams)
    const res = await request({
      url:"/announcement/update",
      method:"POST",
      data:this.QueryParams,
      header:{
        "content-type":"application/json",
        "token":wx.getStorageSync('token')
      },
    });
    console.log(res);
    if(res.data.state){
      wx.navigateBack({
        delta: 1,
      })
    }
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

  }
})