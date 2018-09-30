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
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    let fixingOnce = utils.FilterFxingListUrl(res.data.data),
      { latest_location } = fixingOnce[0],
      { longitude, latitude } = latest_location,
      params = utils.GetUrlParams()
    if (!params.currentPage) params.currentPage = 0
    if (!params.pageSize) params.pageSize = 6
    utils.SetUrlParams(params)
    console.log(params)
    // Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: longitude, lat: latitude })

    // Event.create('map').trigger('GetFixingListOnce', map, fixingOnce)
    Event.create('fixing').trigger('GetFixingList', map, res.data.data, params)
  })
})('sportdata')
