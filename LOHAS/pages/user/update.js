// pages/user/update.js
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import Toast from '../../dist/toast/toast';

const chooseLocation = requirePlugin('chooseLocation');

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
    submit_btn_text: "修改",
    columns: ['衣', '食', '住', '行'],
    default_type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userinfo = wx.getStorageSync('userInfo');
    if (userinfo.avatar) {
      this.setData({
        userinfo: userinfo
      })
      this.setDefaultType();
    }
  },

  async updateInfo() {
    try {
      const res = await request({
        url: "/shopinfo/update",
        method: "POST",
        data: this.data.userinfo,
        header: {
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      if (res.data.state) {
        console.log("修改信息成功！！！");
        wx.removeStorageSync('userInfo');
        wx.setStorageSync('userInfo', this.data.userinfo)
        wx.navigateBack({
          delta: 1,
        })
      }
    } catch (error) {
      console.log(error);
    }
  },

  showPopup() {
    this.setData({
      show_type: true
    });
  },

  onClose() {
    this.setData({
      show_type: false
    });
  },

  onConfirm(event) {
    this.setData({
      show_type: false
    });
    const {
      picker,
      value,
      index
    } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
    var type = "";
    switch (index) {
      case 0:
        type = "clothing";
        break;
      case 1:
        type = "food";
        break;
      case 2:
        type = "housing";
        break;
      case 3:
        type = "transportation";
        break;
      default:
        // 错误
        break;
    }
    this.data.userinfo.shop_type = type;
  },

  onCancel() {
    Toast('取消');
    this.setData({
      show_type: false
    });
  },

  onChangeShopName(event) {
    this.data.userinfo.shop_name = event.detail;
  },

  onCHangeShopIntro(event) {
    this.data.userinfo.shop_intro = event.detail;
  },

  onChangeShopLOHASInfo(event) {
    this.data.userinfo.shop_lohas_info = event.detail;
  },

  onChangeShopBusinessTime(event) {
    this.data.userinfo.shop_business_hours = event.detail;
  },

  setDefaultType() {
    var index = 0;
    if (this.data.userinfo.shop_type === 'clothing') {
      index = 0;
    } else if (this.data.userinfo.shop_type === 'food') {
      index = 1;
    } else if (this.data.userinfo.shop_type === 'housing') {
      index = 2;
    } else if (this.data.userinfo.shop_type === 'transportation') {
      index = 3;
    }
    this.setData({
      default_type: index
    })
  },

  onChooseLocation() {
    const key = 'YWWBZ-K7QKD-HHG4G-HD3AP-RJRHS-HHFEN'; //使用在腾讯位置服务申请的key
    const referer = 'LOHAS'; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: 39.89631551,
      longitude: 116.323459711
    });
    const category = '生活服务,娱乐休闲';

    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
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
    const location = chooseLocation.getLocation();
    if (location != null) {
      this.data.userinfo.shop_latitude = location.latitude;
      this.data.userinfo.shop_longitude = location.longitude;
      this.data.userinfo.shop_address = location.address;
      console.log(this.data.userinfo);
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
    chooseLocation.setLocation(null);
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