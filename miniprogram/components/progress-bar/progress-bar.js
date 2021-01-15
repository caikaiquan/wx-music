// components/progress-bar/progress-bar.js
let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
let duration = 0;
let durationIndex = 0;
let currentSec = -1;
let isMoving = false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    ready() {
      this.getMovableDis()
      this.bindBGMEvent()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00"
    },
    movableDis: 0,
    progress: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(movableAreaWidth, 'movableAreaWidth', movableViewWidth, 'movableViewWidth')
      })
    },
    
    onChange(event) {
      const { detail: { source, x } } = event;
      if (source === 'touch') {
        this.data.progress = x/(movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = x
        isMoving = true
      }
    },
    // 当前触摸结束的时候
    onTouchEnd() {
      // // 拖动后音乐的秒数
      const currentTime = backgroundAudioManager.currentTime
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: this.dateFormat(currentTime)
      })
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
    },
    bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
      })

      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })

      backgroundAudioManager.onPause(() => {
        console.log('Pause')
      })

      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })

      backgroundAudioManager.onCanplay(() => {
        // 首次进来肯能获取不到backgroundAudioManager.duration
        let durationInter = setInterval(() => {
          console.log(111)
          if (duration || durationIndex >= 50) {
            if (duration) {
              this.setTime()
            }
            clearInterval(durationInter)
            durationInter = 0;
          } else {
            durationIndex++
            duration = backgroundAudioManager.duration
          }
        }, 200)
      })

      backgroundAudioManager.onTimeUpdate(() => {
        const currentTime = Math.floor(backgroundAudioManager.currentTime);
        // 控制时间更新频率 每一秒刷新一次
        if (currentTime === currentSec || isMoving) {
          return
        }
        currentSec = Math.floor(currentTime)
        const movableDis = (movableAreaWidth - movableViewWidth) * currentTime / duration
        const progress = currentTime / duration * 100
        const currentTimeFmt = this.dateFormat(currentTime);
        this.setData({
          movableDis,
          progress,
          ['showTime.currentTime']: currentTimeFmt,
        })
      })

      backgroundAudioManager.onEnded(() => {
        console.log("onEnded")
        this.triggerEvent('musicEnd')
      })

      backgroundAudioManager.onError((res) => {
        console.log(res, '播放出现错误')
      })
    },
    setTime() {
      const ducationfmt = this.dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: ducationfmt
      })
    },
    dateFormat(sec) {
      let min = Math.floor(sec / 60)
      let ss = Math.floor(sec % 60)
      min = min < 10 ? `0${min}` : min;
      ss = ss < 10 ? `0${ss}` : ss
      return `${min}:${ss}`
    }
  }
})
