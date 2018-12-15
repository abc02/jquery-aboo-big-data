
// 导航栏模块
var navigationMenu = (function ($el) {
  Event.create('navigationMenu').listen('loginSuccess', function () {
    navigationMenu.refresh()
  })

  return {
    refresh() {
      $el.on('click', '.nav-menu', function (e) {
        e.preventDefault()
        var $currentTarget = $(e.currentTarget),
          classNames = ['index', 'control', 'trajectory', 'sportdata', 'sms', 'print-center'],
          result = classNames.filter(className => $currentTarget.hasClass(className)),
          params = utils.GetUrlParams()
        if (params.fixingId) delete params.fixingId
        location.assign(`${result[0]}.html?${Qs.stringify(params)}`)
      })
    }
  }
})($('.navigation-menu'))