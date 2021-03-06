// 运动数据模块
var sportdata = (function (pageName) {
  var userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) login.redirect('login')
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')

  var params = utils.GetUrlParams()
  // init url params page, pageSize, tabindex1
  params.currentPage = 0
  params.pageSize = 5
  params.fixingListsTabIndex = 0
  utils.SetUrlParams(params)
  var fixing = {
    currentTime: utils.handleTimestampToDate(new Date())//当天
  }
  $('#datepicker').attr('value', fixing.currentTime)
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {

    Event.create('fixing').trigger('sportdata', null, res.data.data, params, fixing)
    Event.create('fixing').trigger('initFixingSportData', null, res.data.data, params, fixing)
  })
})()
