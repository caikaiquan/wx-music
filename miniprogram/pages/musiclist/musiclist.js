// miniprogram/pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusiclist(options.playlistId)
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

  /**
   * 获取musiclist
   */
  getMusiclist(playlistId){
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musiclist',
        playlistId: Number(playlistId)
      }
    })
    .then( res => {
      console.log('获取歌单列数据',res)
      wx.hideLoading()
      const pl = res.result.playlist
      this.setMusicList(pl.tracks)
      this.setData({
        musiclist: pl.tracks,
        listInfo: {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      })
    })
    .catch(err => {
      wx.hideLoading()
      console.log('获取musiclist失败', err)
    })
  },
  // 存储musiclist数据到本地
  setMusicList(list){
    wx.setStorage({
      data: list,
      key: 'musiclist',
    })
  }
})