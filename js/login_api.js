
var LOGIN_API = (function () {
  // 账户登录
  function AdminLoginAccount({ username, password }) {
    return axios.post('/AdminLoginAccount', Qs.stringify({ username, password }))
  }
  // 修改管理密码
  function AdminEditPassword({ adminId, oldPassword, newPassword }) {
    return axios.post('/AdminEditPassword', Qs.stringify({ adminId, oldPassword, newPassword }))
  }
  // 操作用户拉黑状态
  function AdminUpdateUserStatusInfo({ adminId, userId, userStatus }) {
    return axios.post('/AdminUpdateUserStatusInfo', Qs.stringify({ adminId, userId, userStatus }))
  }
  return {
    AdminLoginAccount,
    AdminEditPassword,
    AdminUpdateUserStatusInfo,
  }
})()
