import {
  request
} from "../../../request/index.js";
import regeneratorRuntime from "../../../lib/runtime/runtime";
import Dialog from '../../../dist/dialog/dialog';
import {
  showModal
} from "../../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ddl_products: [],
    total_page:0,
  },

  // 接口要的参数
  QueryParams: {
    page_num: 1,
    page_size: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      ddl_products: [],
    })
    this.getDdlProductList();
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
      ddl_products: [],
      total_page:0,
    })

    // 重置页码
    this.QueryParams.page_num = 1;
    // 发送请求
    this.getDdlProductList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  jumpPage: function () {
    wx.navigateTo({
      url: './update'
    })
  },

  // 获取临期商品列表
  async getDdlProductList() {
    const ddl_product = wx.getStorageSync('ddl_product');
    if (!ddl_product) {
      // 不存在 发送请求获取数据
      this.getDdlProduct();
    } else {
      // 有旧的数据 判断过期时间
      if (Date.now() - ddl_product.time > 1000 * 10) {
        // 重新发送请求
        this.getDdlProduct();
      } else {
        // 可以使用旧数据
        this.setData({
          ddl_products: ddl_product
        });
      }
    }

    // 关闭下拉刷新窗口
    wx - wx.stopPullDownRefresh();
  },

  // 获取临期商品数据
  async getDdlProduct() {
    try {
      const res = await request({
        url: "/ddlproduct/getmine",
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
          ddl_products: [...this.data.ddl_products, ...res.data.ddlproduct_item_list],
          total_page: res.data.total_page
        });
        wx - wx.setStorageSync('ddl_product', {
          time: Date.now(),
          date: this.ddlproduct_item_list
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // 删除临期商品
  async deleteDdlProduct(id) {
    try {
      const res = await request({
        url: "/ddlproduct/delete",
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

  // 删除修改临期商品
  async onClose(event) {
    try {
      const {
        position,
        instance,
        name
      } = event.detail;
      switch (position) {
        case 'left':
          wx.navigateTo({
            url: './update?ddl_product_id=' + name,
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
          const res = await showModal({
            title: "删除临期商品",
            content: "您是否要删除",
            confirmColor: "#d81e06"
          })
          if (res.confirm) {
            this.deleteDdlProduct(name);
            instance.close();
          } else if (res.cancel) {
            instance.close();
          }
          break;
      }
    } catch (error) {
      console.log(error);
    }
  },
})