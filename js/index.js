// 首页
var index = (function () {
  //  获取loacl userinfo
  var userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  // 未登录 跳转 登录页面
  if (!userInfo) login.redirect('login')
  // 已登录 设置菜单栏
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')
  var params = utils.GetUrlParams()
  // init url params page, pageSize, tabindex1
  params.currentPage = 0
  params.pageSize = 11
  params.fixingListsTabIndex = 0
  utils.SetUrlParams(params)
  var fixing = {
    currentTime: utils.handleTimestampToDate(new Date()),//当天
    type: 'init'
  }
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    // 通知地图更新，列表更新
    Event.create('map').trigger('index', map, res.data.data, params)
    Event.create('fixing').trigger('index', map, res.data.data, params, fixing)
  })
})()