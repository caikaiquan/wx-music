// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  /**
   * 数据监听器
   * **/
  observers: {
    ['playlist.playCount'](count) {
      this.setData({
        _count: this.tranNumber(count, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tranNumber(num, point) {
      const numStr = num.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        const decimal = numStr.substr(numStr.length - 4, point)
        return `${parseFloat(parseInt(numStr / 10000))}.${decimal}万`
      } else {
        const decimal = numStr.substr(numStr.length - 8, point)
        return `${parseFloat(parseInt(numStr / 100000000))}.${decimal}亿`
      }
    },
    /** 
    * 点击歌曲
    * **/
    goToMusiclist() {
      console.log('点击了歌曲列表')
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`
      })
    }
  },
})
