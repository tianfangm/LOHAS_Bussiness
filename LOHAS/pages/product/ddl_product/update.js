// pages/product/ddl_product/update.js
import {
  request,
} from "../../../request/index.js";
import regeneratorRuntime from "../../../lib/runtime/runtime";
import { uploadFile } from '../../../utils/asyncWx.js'

const twoYearsAgo = 365 * 24 * 3600 * 1000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDate: false,
    minDate: new Date().getTime() - twoYearsAgo,
    maxDate: new Date().getTime() + twoYearsAgo,
    defaultDate: [new Date().getTime(), new Date().getTime()],
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },

    QueryParams: {
      "current_cost": null,
      "discount": 0,
      "expiry_date": "",
      "origin_cost": null,
      "product_id": 0,
      "product_intro": "",
      "product_name": "",
      "product_pic": "",
      "product_pubdate": "",
      "production_date": ""
    },
    fileList: [],
    page_type: 0,
    submit_btn_text: "发布",
    ddl_product_id: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.ddl_product_id) {
      this.setData({
        page_type: 1,
        submit_btn_text: "修改",
      })
      this.data.QueryParams.product_id = options.ddl_product_id;
      this.getDdlProductById();
    }
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

  onDisplay() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      date: `生产日期：${this.formatDate(start)} 保质期至： ${this.formatDate(end)}`,
    });
    this.data.QueryParams.production_date = start;
    this.data.QueryParams.expiry_date = end;
  },

  onChangeProductName(event) {
    this.data.QueryParams.product_name = event.detail;
  },

  onChangeProductCurrentPrice(event) {
    this.data.QueryParams.current_cost = event.detail;
  },

  onChangeProductOriginalPrice(event) {
    this.data.QueryParams.origin_cost = event.detail;
  },

  onChangeProductBriefIntroduction(event) {
    this.data.QueryParams.product_intro = event.detail;
  },

  onBottomButtonClick() {
    if (this.data.page_type) {
      // 修改
      this.updataDdlProduct();
    } else {
      // 发布
      this.createDdlProduct();
    }
  },

  // 修改临期商品
  async updataDdlProduct() {
    try {
      if (this.data.fileList[0].url != this.data.QueryParams.product_pic) {
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
        this.data.QueryParams.product_pic = obj.pic_url;
      }
      if (true) {
        const res1 = await request({
          url: "/ddlproduct/update",
          method: "POST",
          data: this.data.QueryParams,
          header: {
            "content-type": "application/json",
            "token": wx.getStorageSync('token')
          }
        });
        console.log(res1);
        if (res1.data.state) {
          console.log("修改成功");
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  // 发布临期商品
  async createDdlProduct() {
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
          url: "/ddlproduct/create",
          method: "POST",
          data: this.data.QueryParams,
          header: {
            "content-type": "application/json",
            "token": wx.getStorageSync('token')
          }
        });
        if (res1.data.state) {
          console.log(res1.data)
          console.log("发布成功");
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  async getDdlProductById() {
    try {
      const res = await request({
        url: "/ddlproduct/querybyId",
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
        console.log("查询成功！");
        this.setData({
          QueryParams: res.data,
          fileList: [{
            url: res.data.product_pic,
            name: '预加载图片'
          }]
        })
      }
    } catch (error) {
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