// 首页模块
var index = (function () {
  //  获取loacl userinfo
  let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  // 未登录 跳转 登录页面
  if (!userInfo) login.redirect('login')
  // 已登录 设置菜单栏
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')
  let params = utils.GetUrlParams()
  // init url -> page, pageSize, tabindex1
  params.currentPage = 0
  params.pageSize = 10
  params.fixingListsTabIndex = 0
  utils.SetUrlParams(params)
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    // 通知地图更新，列表更新
    Event.create('map').trigger('GetFixingList', map, res.data.data, params)
    Event.create('fixing').trigger('index', map, res.data.data, params)
  })
})()