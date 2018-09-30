
// 导航栏模块
var navigationMenu = (function ($el) {
  Event.create('navigationMenu').listen('loginSuccess', function () {
    navigationMenu.refresh()
  })

  return {
    refresh() {
      $el.on('click', '.nav-menu', function (e) {
        e.preventDefault()
        let $currentTarget = $(e.currentTarget),
          classNames = ['index', 'control', 'trajectory', 'sportdata'],
          result = classNames.filter(className => $currentTarget.hasClass(className)),
          params = utils.GetUrlParams()
        switch (result[0]) {
          case 'index':
            params.pageSize = 10
            break;
          case 'control':
            params.pageSize = 6
            break;
          case 'trajectory':
            params.pageSize = 6
            break;
          case 'sportdata':
            params.pageSize = 6
            break;
        }
        location.assign(`${result[0]}.html?${Qs.stringify(params)}`)
      })
    }
  }
})($('.navigation-menu'))