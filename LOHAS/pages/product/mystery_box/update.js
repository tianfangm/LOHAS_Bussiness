// pages/product/mystery_box/update.js

import {
  request,
} from "../../../request/index.js";
import regeneratorRuntime from "../../../lib/runtime/runtime";
import { uploadFile } from '../../../utils/asyncWx.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom_button_text: "发布",
    fileList: [],
    page_type: 0, // 页面类型，0为发布，1为修改
    QueryParams: {
      "price": null,
      "product_id": 0,
      "product_intro": "",
      "product_name": "",
      "product_pic": "",
      "product_pubdate": ""
    },
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.product_id) {
      // 修改
      this.setData({
        page_type: 1,
        bottom_button_text: "修改",
      });
      this.data.QueryParams.product_id = options.product_id;
      this.getMysterBoxById();
    }
    console.log(this.data.fileList)
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
  },

  // 删除预览图片
  onDeleteClick(e) {
    this.data.fileList.splice([e.detail.index], 1)
    this.setData({
      fileList: this.data.fileList
    });
    let img_list = []
    this.data.fileList.forEach(element => {
      img_list.push(element.url)
    });
    // 删除后的图片传给父组件，父组件setData赋值数据
    this.triggerEvent('dalete', img_list);
  },

  async onBottomBtnClick() {
    if (this.data.page_type) {
      // 修改盲盒
      this.changeMysteryBox();
    } else {
      // 发布盲盒
      this.createMysteryBox();
    }
  },

  // 修改盲盒
  async changeMysteryBox() {
    try {
      // 判断图片是否修改
      if (this.data.fileList[0].url != this.data.QueryParams.product_pic) {
        console.log("图片修改！！！");
        const res = await uploadFile({
          url: "/pic/upload",
          method: "POST",
          name: "file",
          filePath: this.data.fileList[0].url,
          formData: {
            "file": "file"
          }
        });
        var obj = JSON.parse(res.data);
        if (obj.status === "done") {
          console.log("修改图片成功！");
          this.data.QueryParams.product_pic = obj.pic_url;
        }
      }
      const res1 = await request({
        url: "/mysterybox/update",
        method: "POST",
        data: this.data.QueryParams,
        header: {
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      console.log(res1);
      if (res1.data.state) {
        wx.navigateBack({
          delta: 1,
        })
        console.log("修改盲盒成功！！！");
      } else {
        console.log("修改失败！！！")
      }
    } catch (error) {
      console.log(error);
    }

  },

  // 发布盲盒
  async createMysteryBox() {
    try {
      const res = await uploadFile({
        url: "/pic/upload",
        method: "POST",
        name: "file",
        filePath: this.data.fileList[0].url,
        formData: {
          "file": "file"
        }
      });
      var obj = JSON.parse(res.data);
      if (obj.status === "done") {
        this.data.QueryParams.product_pic = obj.pic_url;
        const res1 = await request({
          url: "/mysterybox/create",
          method: "POST",
          data: this.data.QueryParams,
          header: {
            "content-type": "application/json",
            "token": wx.getStorageSync('token')
          }
        });
        console.log(res1);
        if (res1.data.state) {
          wx.navigateBack({
            delta: 1,
          })
          console.log("发布盲盒成功！！！");
        }
      } else {
        console.log("发布失败");
      }
    } catch (error) {
      console.log(error)
    }
  },

  onChangeMysteryBoxName(event) {
    this.data.QueryParams.product_name = event.detail;
  },

  onChangeMysteryBoxIntro(event) {
    this.data.QueryParams.product_intro = event.detail;
  },

  onChangeMysteryBoxPrice(event) {
    this.data.QueryParams.price = event.detail;
  },

  // 根据id查找信息
  async getMysterBoxById() {
    try {
      const res = await request({
        url: "/mysterybox/querybyId",
        method: "GET",
        data: {
          product_id: this.data.QueryParams.product_id
        },
        header: {
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      if (res.statusCode === 200) {
        // 查询成功
        this.setData({
          QueryParams: res.data,
          fileList: [{
            url: res.data.product_pic,
            name: '预加载图片'
          }]
        });
        console.log("查询成功！");
      } else {
        console.log("查询失败！！！")
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