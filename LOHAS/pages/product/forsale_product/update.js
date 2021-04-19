// pages/product/forsale_product/update.js
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
    bottom_btn_text: "发布",
    page_type: 0, // 0 发布，1更新

    fileList: [],
    QueryParams: {
      "current_cost": null,
      "discount": 0,
      "origin_cost": null,
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
    if (options.forsale_product_id) {
      this.setData({
        page_type: 1,
        bottom_btn_text: "更新",
      });
      this.data.QueryParams.product_id = options.forsale_product_id;
      this.getForsaleProductById();
    }
  },

  onChangeForslaeProductName(event) {
    this.data.QueryParams.product_name = event.detail;
  },

  onChangeForslaeProductCurrentPrice(event) {
    this.data.QueryParams.current_cost = event.detail;
  },

  onChangeForslaeProductOriginalPrice(event) {
    this.data.QueryParams.origin_cost = event.detail;
  },

  onChangeForslaeProductBriefIntroduction(event) {
    this.data.QueryParams.product_intro = event.detail;
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

  // 修改折扣商品
  async updateForsaleProduct() {
    try {
      if (this.data.fileList[0].url != this.data.QueryParams.product_pic) {
        // 图片被更新，上传图片
        const res = await uploadFile({
          url: "/pic/upload",
          method: "POST",
          name: "file",
          filePath: this.data.fileList[0].url,
          formData: {
            "file": "file"
          }
        });
        var obj = JSON.parse(res.data)
        console.log(obj)
        this.data.QueryParams.product_pic = obj.pic_url;
      }
      if (true) {
        const res1 = await request({
          url: "/forsaleproduct/update",
          method: "POST",
          data: this.data.QueryParams,
          header: {
            "content-type": "application/json",
            "token": wx.getStorageSync('token')
          }
        });
        if (res1.data.state) {
          console.log(res1.data)
          console.log("更新成功");
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  // 发布折扣商品
  async createForsaleProduct() {
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
      var obj = JSON.parse(res.data)
      console.log(obj)
      this.data.QueryParams.product_pic = obj.pic_url;
      if (true) {
        const res1 = await request({
          url: "/forsaleproduct/create",
          method: "POST",
          data: this.data.QueryParams,
          header: {
            "content-type": "application/json",
            "token": wx.getStorageSync('token')
          }
        });
        if (res1.data.state) {
          console.log(res1.data)
          console.log("发布折扣商品成功！！！");
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  async onBottomButtonClick() {
    if (this.data.page_type) {
      // 更新
      this.updateForsaleProduct();
    } else {
      // 发布
      this.createForsaleProduct();
    }
  },

  // 通过id查询折扣商品详细信息
  async getForsaleProductById() {
    try{
      const res = await request({
        url: "/forsaleproduct/querybyId",
        method: "GET",
        data: {
          product_id: this.data.QueryParams.product_id
        },
        header: {
          "content-type": "application/json",
          "token": wx.getStorageSync('token')
        }
      });
      console.log(res)
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
    }
    catch(error){
      console.log(error)
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