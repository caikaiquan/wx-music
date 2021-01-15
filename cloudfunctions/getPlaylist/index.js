// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
cloud.init()
// 初始化云数据库
const db = cloud.database()
const playlistCollection = db.collection('playlist')
// 云函数入口函数
exports.main = async (event, context) => {
  /** 
   * 每日获取24个推荐歌单 存储到云数据库
   * 存储前需要对比数据库是否已经存在数据
   * **/
  // 获取到云数据库中所有的数据的id
  // 云函数限制最大只能获取100条数
  const playlistData = []
  const count = await playlistCollection.count()
  const total = count.total
  const MAX_LIMIT = 10
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  if (total > MAX_LIMIT) {
    for (let i = 0; i < batchTimes; i++) {
      const res = await playlistCollection.skip(MAX_LIMIT * i).limit(MAX_LIMIT).get()
      playlistData.push(...res.data)
    }
  } else {
    const res = await playlistCollection.get()
    playlistData.push(...res.data)
  }

  const playlistIdList = playlistData.map(item => item.id);
  // 获取线上云音乐的歌单数据
  const URL = 'http://neteasecloudmusicapi.zhaoboy.com/top/playlist?limit=24'
  const res = await axios.get(URL)
  const cloudData = res.data.playlists;
  let SuccessNum = 0;
  let repeatNum = 0;
  let errNum = 0;
  for (let item of cloudData) {
    if (playlistIdList.includes(item.id)) {
      repeatNum++
    } else {
      await playlistCollection.add({ data: { ...item, createTime: db.serverDate() } }).then(res => {
        SuccessNum++
      }).catch(err => {
        errNum++
      })
    }
  }

  console.log(`存储成功的数据`, SuccessNum)
  console.log(`已经存在的数据`, repeatNum)
  console.log(`存储失败的数据`, errNum)
  return null
}