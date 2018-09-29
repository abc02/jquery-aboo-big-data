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

    Event.create('map').trigger('GetFixingList', map, res.data.data, { currentPage: 0, pageSize: 10 })
    Event.create('fixing').trigger('GetFixingList', map, res.data.data,  { currentPage: 0, pageSize: 10 })
    // Event.create('fixing').trigger('fixingSearch', res.data.data)
    // Event.create('fixing').trigger('fixingListsTab', res.data.data)
    // Event.create('fixing').trigger('fixingListsPagination', res.data.data)
    // Event.create('map').trigger('mapMarkerPoint', map, res.data.data)
    // Event.create('map').trigger('mapMoveendEvent', map, res.data.data)
    // Event.create('map').trigger('mapZoomendEvent', map, res.data.data)
    // Event.create('fixing').trigger('fixingMarkerCount', map)
  })
})()