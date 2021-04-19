// pages/store/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:"",
    longitude:"",
    userinfo:[],
    scale:14,
    markers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  setMarkers(){
    var temp_markers = [];
    temp_markers.push({
      id: 0,
      iconPath: "../../images/map.png",
      latitude: this.data.userinfo.shop_latitude,
      longitude: this.data.userinfo.shop_longitude,
      width: 28,
      height: 32,
      desc: this.data.userinfo.shop_id, //这里才是shop_id
      label: {
        content: this.data.userinfo.shop_name
      }
    });
    this.setData({
      markers:temp_markers
    })
    console.log(this.data.markers)
  },

  bindtap(e) {
    console.log("bindtap", e);
    // console.log(this.data.latitude, this.data.longitude)
    this.mpCtx.moveToLocation({
      longitude:this.data.userinfo.shop_longitude,
      latitude:this.data.userinfo.shop_latitude,
      scale:13,
      success:()=>{
        console.log("移过去了")
      }
    });
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
    const userinfo = wx.getStorageSync('userInfo');
    var that = this;
    that.setData({
      userinfo:userinfo
    });
    this.setMarkers();
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        that.mpCtx = wx.createMapContext("myMap");
        //赋值经纬度
        // console.log("onLoad", res),
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      }
    })
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