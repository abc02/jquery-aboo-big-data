
// 导航栏模块
var navigationMenu = (function ($el) {
  Event.create('navigationMenu').listen('loginSuccess', function () {
    navigationMenu.refresh()
  })

  return {
    refresh() {
      $el.on('click', '.nav-menu', function (e) {
        e.preventDefault()
        const $CURRENTTAGET = $(e.currentTarget),
          CLASSNAMES = ['index', 'control', 'trajectory', 'sportdata'],
          RESULT = CLASSNAMES.filter(className => $CURRENTTAGET.hasClass(className)),
          PARAMS = utils.GetUrlParams()
        location.assign(`${RESULT[0]}.html?${Qs.stringify(PARAMS)}`)
      })
    }
  }
})($('.navigation-menu'))