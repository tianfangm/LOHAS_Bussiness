// pages/product/mystery_box/update.js

import{request,uploadFile} from "../../../request/index.js";
import regeneratorRuntime from "../../../lib/runtime/runtime";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom_button_text: "发布",
    fileList:[],
    page_type:0, // 页面类型，0为发布，1为修改
  },

  QueryParams: {
    "price": 0,
    "product_intro": "",
    "product_name": "",
    "product_pic": ""
  },

  // 文件上传完毕后触发afterread回调，获取对应文件的临时地址，使用wx.uploadFile将图片上传到远程服务器上
  async afterRead(event) {
    console.log(event);
    const {
      file
    } = event.detail;
    const {
      fileList = []
    } = this.data;
    fileList.push({
      url: file.url,
      name: "product_pic"
    });
    this.setData({
      fileList: fileList
    })
    console.log(fileList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.product_id){
      this.setData({
        page_type:1,
        bottom_button_text:"修改"
      })
    }
  },

  async onBottomBtnClick(){
    if(this.data.page_type){
      // 修改盲盒
      this.changeMysteryBox();
    }
    else{
      // 发布盲盒
      this.createMysteryBox();
    }
  },

  // 修改盲盒
  async changeMysteryBox(){
    
  },

  // 发布盲盒
  async createMysteryBox(){
    const res = await uploadFile({
      url:"/pic/upload",
      method:"POST",
      name:"file",
      filePath:this.data.fileList[0].url,
      formData:{
        "file":"file"
      }
    });
    var obj = JSON.parse(res.data);
    if(obj.status==="done"){
      this.QueryParams.product_pic = obj.pic_url;
      const res1=await request({
        url:"/mysterybox/create",
        method : "POST",
        data:this.QueryParams,
        header:{
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      if(res1.data.state){
        wx.navigateBack({
          delta: 1,
        })
        console.log("发布盲盒成功！！！");
      }
    }
    else{
      console.log("发布失败");
    }
  },

  onChangeMysteryBoxName(event){
    this.QueryParams.product_name = event.detail;
  },

  onChangeMysteryBoxIntro(event){
    this.QueryParams.product_intro = event.detail;
  },

  onChangeMysteryBoxPrice(event){
    this.QueryParams.price = event.detail;
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