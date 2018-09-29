// 控制中心模块
var control = (function (pageName) {
  if (!(utils.GetUrlPageName().search(pageName) > -1)) {
    return
  }
  let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) {
    login.redirect('login')
  }
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {

    let fixing = utils.FilterFxingListUrl(res.data.data),
      { latest_location, entity_name } = fixing[0],
      { longitude, latitude } = latest_location
    Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: longitude, lat: latitude })
    Event.create('fixing').trigger('fixingSearch', res.data.data)
    Event.create('fixing').trigger('fixingListsTab', res.data.data)
    Event.create('fixing').trigger('fixingListsPagination', fixing, 6)
    Event.create('map').trigger('mapMarkerPoint', map, [fixing[0]])
    Event.create('map').trigger('mapMoveendEvent', map, [fixing[0]])
    Event.create('map').trigger('mapZoomendEvent', map, [fixing[0]])
    Event.create('fixing').trigger('fixingMarkerCount', map)
  })
})('control')