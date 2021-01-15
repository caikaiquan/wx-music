// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const axios = require('axios')
cloud.init()

const musicCollect = cloud.database().collection('playlist')
const musiclistCollect = cloud.database().collection('musiclist')
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  app.router('playlist', async (ctx, next) => {
    const res = await musicCollect
      .skip(event.start) // 跳过指定数量的数据
      .limit(event.count) // 返回指定数量的数据
      .orderBy('createTime', 'desc')
      .get()
      .catch(err => {
        console.log(err)
      })
    ctx.body = res.data
  })

  app.router('musiclist', async (ctx, next) => {
    const axiosFun = () => {
      return new Promise(resolve => {
        axios({
          url: `http://neteasecloudmusicapi.zhaoboy.com/playlist/detail?id=${event.playlistId}`,
          headers: { Cookie: "NMTID=00OrOveuoaaiFeYEUkbqgXT5sFOo9gAAAF2_rfbMw; MUSIC_U=5a3b41428457c72354360379d44b74908e859093d5ebeea421fe9dcfcc49e5eed106471d18c1d4a4; __csrf=7900a2db5862a74409d9a1e8f60f0341; __remember_me=true", withCredentials: true }
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          resolve({ code: '9999', err })
        })
      })
    }
    ctx.body = await axiosFun()
  })

  // 获取播放音乐
  app.router('musicurl', async (ctx, next) => { 
    const URL = `http://neteasecloudmusicapi.zhaoboy.com/song/url?id=${event.musicId}`
    ctx.body = await new Promise(resolve => {
      axios.get(URL).then(res => {
        try {
          const result = res.data.data[0]
          resolve(result)
        } catch (err) {
          resolve({ code: '9999', err })
        }
      }).catch(err => {
        resolve({ code: '9999', err })
      })
    })
  })
  return app.serve()
}