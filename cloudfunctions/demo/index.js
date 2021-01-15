// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  // 返回promise
  // const func = new Promise( resolve => {
  //   setTimeout(() => {
  //     resolve({code: '0000', msg: 'success'})
  //   },1000)
  // })
  // const res = await func
  // return res

  // axios
  // return await axios.get('http://neteasecloudmusicapi.zhaoboy.com/song/url?id=1490122066')
  // let res = axios.get("https://news.ifeng.com/")
  // console.log(res)
  // return res

  return new Promise((resolve, reject) => {
    // 获取歌单列表
    // axios.get('http://neteasecloudmusicapi.zhaoboy.com/top/playlist?limit=24')
  axios.get('http://neteasecloudmusicapi.zhaoboy.com/playlist/detail?id=5332399715',{headers: {Cookie:"NMTID=00OrOveuoaaiFeYEUkbqgXT5sFOo9gAAAF2_rfbMw; MUSIC_U=5a3b41428457c72354360379d44b74908e859093d5ebeea421fe9dcfcc49e5eed106471d18c1d4a4; __csrf=7900a2db5862a74409d9a1e8f60f0341; __remember_me=true", withCredentials: true}})
    .then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}