// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event){
      const dataset = event.currentTarget.dataset
      const musicId = dataset.musicid;
      const index = dataset.index;
      this.setData({
        playingId: musicId
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicId}&index=${index}`,
      })
    }
  }
})
