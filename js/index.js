// 首页模块
var index = (function () {
  if (!(utils.GetUrlPageName().search('index') > -1) && !!(utils.GetUrlPageName().length)) {
    return
  }
  let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) {
    login.redirect('login')
  }
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    let params = utils.GetUrlParams()
    if (!params.currentPage) params.currentPage = 0
    if (!params.pageSize) params.pageSize = 10
    if (params.pageSize < 10) params.pageSize = 10
    utils.SetUrlParams(params)
    Event.create('map').trigger('GetFixingList', map, res.data.data, params)
    Event.create('fixing').trigger('GetFixingList', map, res.data.data,  params)
  })
})()