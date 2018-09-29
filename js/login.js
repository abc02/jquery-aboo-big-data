// 登陆模块
var login = (function ($el) {
  Event.create('login').listen('loginSuccess', function (url) {
    login.redirect(url)
  })
  if ($el.length) {
    $el.submit(function (e) {
      e.preventDefault()
      let $currentTarget = $(e.currentTarget),
        username = $currentTarget.find('#username').val(),
        password = $currentTarget.find('#password').val()
      LOGIN_API.AdminLoginAccount({ username, password }).then(res => {
        let userInfo = res.data
        utils.SetLoaclStorageUserInfo('userinfo', userInfo)
        Event.create('login').trigger('loginSuccess', 'index')
      })
    })
  }
  return {
    redirect: function (url) {
      return location.assign(`${url}.html`)
    }
  }
})($LOGIN_FORM)
