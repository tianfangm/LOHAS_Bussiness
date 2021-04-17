// pages/product/forsale_product/update.js
import{request,uploadFile} from "../../../request/index.js";
import regeneratorRuntime from "../../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom_btn_text: "发布",
    page_type:0, // 0 发布，1更新
  },

  QueryParams: {
    "current_cost": 0,
    "origin_cost": 0,
    "product_id": 0,
    "product_intro": "",
    "product_name": "",
    "product_pic": "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.forsale_product_id){
      this.setData({
        page_type:1,
        bottom_btn_text:"更新"
      });
    }
  },

  onChangeForslaeProductName(event) {
    this.QueryParams.product_name = event.detail;
  },

  onChangeForslaeProductCurrentPrice(event) {
    this.QueryParams.current_cost = event.detail;
  },

  onChangeForslaeProductOriginalPrice(event) {
    this.QueryParams.origin_cost = event.detail;
  },

  onChangeForslaeProductBriefIntroduction(event) {
    this.QueryParams.product_intro = event.detail;
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

  async updateForsaleProduct(){
    try{
      const res = await uploadFile({
        url:"/pic/upload",
        method:"POST",
        name:"file",
        filePath:this.data.fileList[0].url,
        formData:{
          "file":"file"
        }
      });
      var obj = JSON.parse(res.data)
      console.log(obj)
      this.QueryParams.product_pic=obj.pic_url;
      if(true)
      {
        const res1 = await request({
          url : "/forsaleproduct/update",
          method : "POST",
          data:this.QueryParams,
          header:{
            "content-type":"application/json",
            "token":wx.getStorageSync('token')
          }
        });
        console.log(this.QueryParams)
        if(res1.data.state){
          console.log(res1.data)
          console.log("更新成功");
        }
      }
    }
    catch(error){
      console.log(error);
    }
  },

  async onBottomButtonClick(){
    if(this.data.page_type){
      // 更新
      this.updateForsaleProduct();
    }
    else{
      // 发布
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