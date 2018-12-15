// 轨迹管理模块
var trajectory = (function () {
  var userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) login.redirect('login')
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')


  var params = utils.GetUrlParams()
  // init url params page, pageSize, tabindex1
  params.currentPage = 0
  params.pageSize = 5
  params.fixingListsTabIndex ? params.fixingListsTabIndex = Number.parseInt(params.fixingListsTabIndex) : params.fixingListsTabIndex = 0
  utils.SetUrlParams(params)
  var fixing = {
    currentTime: utils.handleTimestampToDate(new Date()),//当天
    type: 'init'
  }
  $('.trajectory-datepicker').datepicker('update', fixing.currentTime)
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    Event.create('fixing').trigger('trajectory', map, res.data.data, params, fixing)
    if (params && params.fixingId) {
      var item = utils.FilterFxingListUrl(res.data.data)[0]
      Event.create('fixing').trigger('GetTrackList', map, item, params, fixing)
    }
  })
})() 