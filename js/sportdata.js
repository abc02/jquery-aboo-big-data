// 运动数据模块
var sportdata = (function (pageName) {
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
    let params = utils.GetUrlParams()
    if (!params.currentPage) params.currentPage = 0
    if (!params.pageSize) params.pageSize = 6
    if (!params.time) params.time = Math.round(new Date() / 1000) //当天
    $('#datepicker').attr('value', utils.handleTimestampToDate(params.time))
    utils.SetUrlParams(params)
    Event.create('fixing').trigger('GetFixingList', map, res.data.data, params)
    FIXING_API.GetFixingSportData({ adminId: userInfo.AdminId, fixingId: params.fixingId, times: params.time }).then(res => {
      if (res.data.ret === 1001) {
        Event.create('sportData').trigger('GetFixingSportData', null, res.data, params)
      }
      if (res.data.ret === 1002) {
        Event.create('sportData').trigger('GetFixingSportData', null, null, params)
        window.alert(res.data.code)
      }
    })
  })
})('sportdata')
