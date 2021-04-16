// pages/product/forsale_product/forsale_product.js
import {
  request,
  uploadFile
} from "../../../request/index.js";
import regeneratorRuntime from "../../../lib/runtime/runtime";
import Dialog from '../../../dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    forsale_products: [],
  },

  QueryParams: {
    page_num: 1,
    page_size: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getForsaleProductList();
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
    // 重置数组
    this.setData({
      forsale_products: []
    })

    // 重置页码
    this.QueryParams.page_num = 1;
    // 发送请求
    this.getForsaleProductList();
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

  jumpPage: function () {
    wx.navigateTo({
      url: './create_forsale_product'
    })
  },
  // 获取折扣商品列表
  async getForsaleProductList() {
    const forsale_product = wx.getStorageSync('forsale_product');
    if (!forsale_product) {
      // 不存在 发送请求获取数据
      this.getForsaleProduct();
    } else {
      // 有旧的数据 判断过期时间
      if (Date.now() - forsale_product.time > 1000 * 10) {
        // 重新发送请求
        this.getForsaleProduct();
      } else {
        // 可以使用旧数据
        this.setData({
          forsale_products: forsale_product
        });
      }
    }

    wx - wx.stopPullDownRefresh();
  },

  // 获取折扣商品数据
  async getForsaleProduct() {
    try {
      const res = await request({
        url: "/forsaleproduct/getmine",
        method: "POST",
        data: this.QueryParams,
        header: {
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      if (res.statusCode == 200) {
        // 把接口数据存入本地缓存
        this.setData({
          // 拼接数组
          forsale_products: [...this.data.forsale_products, ...res.data.forsaleproduct_item_list],
          total_page: res.data.total_page
        });
        wx - wx.setStorageSync('forsale_product', {
          time: Date.now(),
          date: this.ddlproduct_item_list
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // 删除折扣商品
  async deleteForsaleProduct(id) {
    try {
      const res = await request({
        url: "/forsaleproduct/delete",
        method: "POST",
        data: {
          "product_id": id
        },
        header: {
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      console.log(res);
      if (res.state) {
        console.log("删除成功")
      }
    } catch (error) {
      console.log(error);
    }
  },

  /*
   * 滚动条触底事件
   */
  onReachBottom() {
    console.log("页面触底");
    // 判断还有没有下一页数据
    if (this.QueryParams.page_num < this.data.total_page) {
      // 还有下一页
      this.QueryParams.page_num += 1;
      this.getDdlProduct();
    } else {
      //没有下一页
      wx - wx.showToast({
        title: '已经到底啦',
      })
    }
  },

  // 删除修改折扣商品
  onClose(event) {
    const {
      position,
      instance,
      name
    } = event.detail;
    switch (position) {
      case 'left':
        wx.navigateTo({
          url: './update_forsale_product?forsale_product_id=' + name,
        })
        instance.close();
        break;
      case 'cell':
        instance.close();
        break;
      case 'outside':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          this.deleteForsaleProduct(name);
          instance.close();
        }).catch(() => {
          instance.close();
        });
        break;
    }
  },
})