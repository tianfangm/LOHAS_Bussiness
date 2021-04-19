// pages/order/order.js
import {
  request,
} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import Dialog from '../../dist/dialog/dialog';
import { uploadFile } from '../../utils/asyncWx.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    total_page:0,
  },

  QueryParams: {
    page_num: 1,
    page_size: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  async getOrderList(){
    const order = wx.getStorageSync('order');
    if (!order) {
      // 不存在 发送请求获取数据
      this.getOrder();
    } else {
      // 有旧的数据 判断过期时间
      if (Date.now() - order.time > 1000 * 10) {
        // 重新发送请求
        this.getOrder();
      } else {
        // 可以使用旧数据
        this.setData({
          orders: order
        });
      }
    }
    wx.stopPullDownRefresh();
  },

  async getOrder(){
    try {
      const res = await request({
        url: "/mysteryboxorder/shoporder",
        method: "POST",
        data: this.QueryParams,
        header: {
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      console.log(res)
      if (res.statusCode == 200) {
        // 把接口数据存入本地缓存
        this.setData({
          // 拼接数组
          orders: [...this.data.orders, ...res.data.mystery_boxes],
          total_page: res.data.total_page
        });
        wx - wx.setStorageSync('order', {
          time: Date.now(),
          data: this.forsaleproduct_item_list
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  jumpPage: function () {
    wx.navigateTo({
      url: './confirm'
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
    this.setData({
      orders:[],
      total_page:0
    })
    this.getOrderList();
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
    // 重置数组
    this.setData({
      orders: []
    })

    // 重置页码
    this.QueryParams.page_num = 1;
    // 发送请求
    this.getOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面触底");
    // 判断还有没有下一页数据
    if (this.QueryParams.page_num < this.data.total_page) {
      // 还有下一页
      this.QueryParams.page_num += 1;
      this.getOrder();
    } else {
      //没有下一页
      wx - wx.showToast({
        title: '已经到底啦',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})