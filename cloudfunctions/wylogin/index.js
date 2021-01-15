// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const phone = 15911335874
  const password = "123456@ule"
  const URL = `http://neteasecloudmusicapi.zhaoboy.com/login/cellphone?phone=${phone}&md5_password=${password}`
  const res = await axios({
    url: URL,
    withCredentials: true,
  })
  // const wxContext = cloud.getWXContext()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}