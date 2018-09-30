
// 轨迹管理模块
var trajectory = (function (pageName) {
  if (!(utils.GetUrlPageName().search(pageName) > -1)) {
    return
  }
  let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) {
    login.redirect('login')
  }
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')
  $('.datepicker').on('changeDate', function (e) {
    console.log(e)
    // let time = Math.round(new Date($('.datepicker').datepicker('getFormattedDate')) / 1000)
    // Event.trigger('GetFixingSportData', userinfo.AdminId, '中国', fixingId, times)
    // console.log( Math.round(new Date(e.timeStamp) / 1000))
  });
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    let fixingOnce = utils.FilterFxingListUrl(res.data.data),
      { latest_location } = fixingOnce[0],
      { longitude, latitude } = latest_location,
      params = utils.GetUrlParams()
    if (!params.currentPage) params.currentPage = 0
    if (!params.pageSize) params.pageSize = 6
    params.time = Math.round(new Date() / 1000)
    $('.datepicker').val(utils.handleTimestampToDate(params.time))
    utils.SetUrlParams(params)
    // Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: longitude, lat: latitude })
    Event.create('map').trigger('GetTrackList', map, fixingOnce, params)
    Event.create('fixing').trigger('GetTrackList', map, fixingOnce, params)
    Event.create('fixing').trigger('GetFixingList', map, res.data.data, params)
  })
})('trajectory') 