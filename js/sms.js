// 短信中心
var sms = (function () {
  var userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) login.redirect('login')
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')

  var params = utils.GetUrlParams()
  // init url params page, pageSize, tabindex1
  params.currentPage = 0
  params.pageSize = 12
  params.fixingListsTabIndex = 0
  utils.SetUrlParams(params)
  var fixing = {
    currentTime: utils.handleTimestampToDate(new Date()),//当天
    type: 'init'
  }
  $('#datepicker').attr('value', fixing.currentTime)
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {

    Event.create('fixing').trigger('sms', null, res.data.data, params, fixing)
  })
})()
