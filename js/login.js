// 登陆模块
var login = (function ($el) {
  Event.create('login').listen('loginSuccess', function (url) {
    login.redirect(url)
  })
  Event.create('login').listen('logOut', function (url) {
    login.redirect(url)
  })
  if ($el.length) {
    $el.submit(function (e) {
      e.preventDefault()
      var $currentTarget = $(e.currentTarget),
        username = $currentTarget.find('#username').val(),
        password = $currentTarget.find('#password').val()
      LOGIN_API.AdminLoginForData({ username, password }).then(res => {
        if (res.data.ret === 1001) {
          utils.SetLoaclStorageUserInfo('userinfo', res.data)
          Event.create('login').trigger('loginSuccess', 'index')
        }
        if (res.data.ret === 1002) {
          $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
          $('#no-data-ModalCenter').modal('show')
        }
      })
    })
  }
  return {
    redirect: function (url) {
      return location.assign(`${url}.html`)
    }
  }
})($('.login-form'))
