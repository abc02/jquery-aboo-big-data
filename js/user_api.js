
var USER_API = (function () {
  // 后台获取用户总数
  function GetUserCount({ adminId, seach }) {
    return axios.post('/GetUserCount', Qs.stringify({ adminId, seach }))
  }
  // 后台获取用户列表
  function GetUserList({ adminId, start, limit, sidx, sord, seach }) {
    return axios.post('/GetUserList', Qs.stringify({ adminId, start, limit, sidx, sord, seach }))
  }
  // 获取指定用户详情
  function GetUserInfo({ adminId, userId }) {
    return axios.post('/GetUserInfo', Qs.stringify({ adminId, userId }))
  }

  return {
    GetUserCount,
    GetUserList,
    GetUserInfo
  }
})()
