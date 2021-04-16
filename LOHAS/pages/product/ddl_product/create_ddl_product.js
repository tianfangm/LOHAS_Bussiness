import{request,uploadFile} from "../../../request/index.js";
import regeneratorRuntime from "../../../lib/runtime/runtime";

const twoYearsAgo = 365*24*3600*1000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDate:false,
    minDate: new Date().getTime()-twoYearsAgo,
    maxDate: new Date().getTime()+twoYearsAgo,
    defaultDate:[new Date().getTime(),new Date().getTime()],
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },

    submit_btn_text:"发布",

    fileList:[],
  },

  QueryParams:{
    current_cost:0,
    expiry_date:"",
    origin_cost:0,
    product_intro:"",
    product_name:"",
    product_pic:"",
    production_date:""
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

  },

  // 文件上传完毕后触发afterread回调，获取对应文件的临时地址，使用wx.uploadFile将图片上传到远程服务器上
  async afterRead(event) {
    console.log(event);
    const { file } = event.detail;
    const{fileList=[]} = this.data;
    fileList.push({url:file.url,name:"product_pic"});
    this.setData({fileList:fileList})
    console.log(fileList)
  },

  onDisplay() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      date:`生产日期：${this.formatDate(start)} 保质期至： ${this.formatDate(end)}`,
    });
    this.QueryParams.production_date = start;
    this.QueryParams.expiry_date = end;
  },

  onChangeGoodsName(event){
    this.QueryParams.product_name = event.detail;
  },

  onChangeGoodsCurrentPrice(event){
    this.QueryParams.current_cost = event.detail;
  },

  onChangeGoodsOriginalPrice(event){
    this.QueryParams.origin_cost = event.detail;
  },

  onChangeGoodsBriefIntroduction(event){
    this.QueryParams.product_intro = event.detail;
  },

  async createGoods(){
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
          url : "/ddlproduct/create",
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
          console.log("发布成功");
        }
      }
    }
    catch(error){
      console.log(error);
    }
  },
})