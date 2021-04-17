// pages/product/mystery_box/mystery_box.js
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
    bottom_button_context: "发布盲盒",
    mystery_boxs: [],
  },

  QueryParams: {
    page_num: 1,
    page_size: 8,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMysteryBoxList();
  },

  jumpPage() {
    wx.navigateTo({
      url: './update',
    })
  },

  // 获取盲盒列表
  async getMysteryBoxList() {
    const mystery_box = wx.getStorageSync('mystery_box');
    if (!mystery_box) {
      // 不存在 发送请求获取数据
      this.getMysteryBox();
    } else {
      // 有旧的数据 判断过期时间
      if (Date.now() - mystery_box.time > 1000 * 10) {
        // 重新发送请求
        this.getMysteryBox();
      } else {
        // 可以使用旧数据
        this.setData({
          mystery_boxs: mystery_box
        });
      }
    }

    wx - wx.stopPullDownRefresh();
  },

  // 获取盲盒数据
  async getMysteryBox() {
    try {
      const res = await request({
        url: "/mysterybox/getmine",
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
          mystery_boxs: [...this.data.mystery_boxs, ...res.data.mystery_box_list],
          total_page: res.data.total_page
        });
        wx - wx.setStorageSync('mystery_box', {
          time: Date.now(),
          date: this.mystery_box_list
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // 删除盲盒
  async deleteMysteryBox(id) {
    try {
      const res = await request({
        url: "/mysterybox/delete",
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
          url: './update?product_id=' + name,
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
          this.deleteMysteryBox(name);
          instance.close();
        }).catch(() => {
          instance.close();
        });
        break;
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
    // 重置数组
    this.setData({
      mystery_boxs: []
    })

    // 重置页码
    this.QueryParams.page_num = 1;
    // 发送请求
    this.getMysteryBoxList();
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
      this.getMysteryBox();
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