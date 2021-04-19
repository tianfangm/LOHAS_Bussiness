import {
  request,
} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import {showToast} from '../../utils/asyncWx.js'

// pages/announcement/update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom_button_text:"发布",
    page_type:0,
    announcement_id:0,
    QueryParams:{
      "announcement_id": 0,
      "content":"",
      "publish_time": "",
      "title": ""
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.announcement_id){
      this.setData({
        page_type:1,
        bottom_button_text:"修改",
        announcement_id:options.announcement_id
      })
      this.getAnnouncementById();
    }
  },

  // 获取输入标题
  getTitle:function(e){
    this.data.QueryParams.title=e.detail;
  },

  // 获取输入内容
  getContent:function(e){
    this.data.QueryParams.content=e.detail;
  },

  // 修改公告
  async updateAnnouncement(){
    const res = await request({
      url:"/announcement/update",
      method:"POST",
      data:{
        "announcement_id": this.data.QueryParams.announcement_id,
        "context": this.data.QueryParams.content,
        "title": this.data.QueryParams.title
      },
      header:{
        "content-type":"application/json",
        "token":wx.getStorageSync('token')
      },
    });
    console.log(res);
    if(res.data.state){
      Toast.success('发布成功！');
      wx.navigateBack({
        delta: 1,
      })
    }
    else{
      Toast.fail('发布失败！');
    }
  },

  // 发布公告
  async createAnnouncement(){
    try{
      const res = await request({
        url : "/announcement/create",
        method : "POST",
        data:{
          content: this.data.QueryParams.content,
          title: this.data.QueryParams.title
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

  // 点击底部按钮
  async onBottomButtonClick(){
    if(this.data.QueryParams.title.length===0){
      // 给出提示
      const rest = await showToast({
        title: '请输入公告标题！',
        icon: 'error',
        duration: 1500
      });
    }
    else if(this.data.QueryParams.content.length===0){
      const rest = await showToast({
        title: '请输入公告内容！',
        icon: 'error',
        duration: 1500
      });
    }
    else{
      if(this.data.page_type){
        // 修改
        this.updateAnnouncement();
      }else{
        // 发布
        this.createAnnouncement();
      }
    } 
  },

  // 根据id获取公告
  async getAnnouncementById(){
    const res = await request({
      url:"/announcement/querybyId",
      method:"GET",
      data:{
        announcement_id:this.data.announcement_id
      },
      header:{
        "content-type":"application/json",
        "token":wx.getStorageSync('token')
      }
    });
    console.log(res);
    if(res.statusCode===200){
      console.log("查询成功！")
      this.setData({
        QueryParams:res.data
      });
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