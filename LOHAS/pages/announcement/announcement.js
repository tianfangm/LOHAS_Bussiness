// pages/announcement/announcement.js
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
import Dialog from '../../dist/dialog/dialog';
import {showModal} from '../../utils/asyncWx.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 公告列表
    shop_announcements: [],
    total_page: 0
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

  // 获取公告列表
  async getAnnouncementList() {
    const Announcements = wx.getStorageSync('announcement');
    if (!Announcements) {
      // 不存在 发送请求获取数据
      this.getAnnouncement();
    } else {
      // 有旧的数据 判断过期时间
      if (Date.now() - Announcements.time > 1000 * 10) {
        // 重新发送请求
        this.getAnnouncement();
      } else {
        // 可以使用旧数据
        this.setData({
          shop_announcements: Announcements
        });
      }
    }

    wx - wx.stopPullDownRefresh();
  },

  // 获取数据
  async getAnnouncement() {
    try {
      const res = await request({
        url: "/announcement/getmine",
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
          shop_announcements: [...this.data.shop_announcements, ...res.data.shop_announcements],
          total_page: res.data.total_page
        });
        wx - wx.setStorageSync('announcement', {
          time: Date.now(),
          date: this.shop_announcements
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // 删除公告
  async deleteAnnouncement(id) {
    try {
      const res = await request({
        url: "/announcement/delete",
        method: "POST",
        data: {
          "announcement_id": id
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
      shop_announcements:[],
      total_page:0
    })
    this.getAnnouncementList();
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
      shop_announcements: []
    })

    // 重置页码
    this.QueryParams.page_num = 1;
    // 发送请求
    this.getAnnouncementList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /*
   * 页面跳转
   */
  jumpPage: function () {
    wx.navigateTo({
      url: './update'
    })
  },

  /*
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("页面触底");
    // 判断还有没有下一页数据
    if (this.QueryParams.page_num < this.data.total_page) {
      // 还有下一页
      this.QueryParams.page_num += 1;
      this.getAnnouncement();
    } else {
      //没有下一页
      wx - wx.showToast({
        title: '已经到底啦',
      })
    }
  },

  // 删除公告
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
            url: './update?announcement_id=' + name,
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
            title:"删除公告",
            content:"您是否要删除",
            confirmColor:"#d81e06"
          })
          if(res.confirm){
            this.deleteAnnouncement(name);
            instance.close();
          }
          else if(res.cancel){
            instance.close();
          }
          break;
      }
    } catch (error) {
      console.log(error);
    }
  },
})