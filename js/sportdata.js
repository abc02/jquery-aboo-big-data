// 运动数据模块
var sportdata = (function (pageName) {
  if (!(utils.GetUrlPageName().search(pageName) > -1)) {
    return
  }
  let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  console.log(userInfo)
  if (!userInfo) {
    login.redirect('login')
  }
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')
})('sportdata')
