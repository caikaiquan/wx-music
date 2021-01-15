// pages/playlist/playlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [
      {
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: [],
    limitCount: 12,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlayList()

    wx.cloud.callFunction({
      name: 'getPlaylist'
    })
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
  onPullDownRefresh: function(){
    console.log('下拉刷新')
    this.setData({
      playlist: []
    })
    this.getPlayList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getPlayList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* 
  * 获取歌曲推荐列表  
  */
  getPlayList() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: "playlist",
        start: this.data.playlist.length,
        count: this.data.limitCount
      }
    })
      .then(res => {
        wx.hideLoading()
        const addList = res.result;
        if (addList.length) {
          const newList = [...this.data.playlist, ...addList]
          wx.stopPullDownRefresh()
          this.setData({
            playlist: newList
          })
        }
      })
      .catch(err => {
        wx.hideLoading()
      })
  }
})