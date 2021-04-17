// pages/user/update.js
import{request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_type:false,
    uesrinfo: [],
    submit_btn_text:"修改",
    columns: ['衣', '食', '住', '行'],
    default_type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userinfo = wx.getStorageSync('userInfo');
    this.setData({
      userinfo: userinfo
    })
    this.setDefaultType();
  },

  async updateInfo(){
    const res = await request({
      url:"/shopinfo/update",
      method:"POST",
      data:this.data.userinfo,
      header:{
        "content-type":"application/json",
        "token":wx.getStorageSync('token')
      }
    });
    if(res.data.state){
      console.log("修改成功！！！");
      wx.removeStorageSync('userInfo');
      wx.setStorageSync('userInfo', this.data.userinfo)
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  showPopup() {
    this.setData({ show_type: true });
  },

  onClose() {
    this.setData({ show_type: false });
  },

  onConfirm(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
    var type = "";
    switch(index){
      case 0:
        type="clothing";
        break;
      case 1:
        type="food";
        break;
      case 2:
        type="housing";
        break;
      case 3:
        type="transportation";
        break;
      default:
        // 错误
        break;
    }
    this.data.userinfo.shop_type = type;
  },

  onCancel() {
    Toast('取消');
  },

  onChangeShopName(event){
    this.data.userinfo.shop_name=event.detail;
  },

  onCHangeShopIntro(event){
    this.data.uesrinfo.shop_intro=event.detail;
  },

  onChangeShopLOHASInfo(event){
    this.data.userinfo.shop_lohas_info=event.detail;
  },

  onChangeShopAddress(event){
    this.data.userinfo.shop_address=event.detail;
  },

  onChangeShopBusinessTime(event){
    this.data.userinfo.shop_business_hours=event.detail;
  },

  setDefaultType(){
    var index=0;
    if(this.data.userinfo.shop_type==='clothing'){
      index = 0;
    }
    else if(this.data.userinfo.shop_type==='food'){
      index = 1;
    }
    else if(this.data.userinfo.shop_type==='housing'){
      index = 2;
    }
    else if(this.data.userinfo.shop_type==='transportation'){
      index = 3;
    }
    this.setData({
      default_type:index
    })
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