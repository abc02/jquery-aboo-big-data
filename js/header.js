
// 头部模块
var header = (function ($el) {
  Event.create('header').listen('loginSuccess', function (userInfo) {
    header.refresh(userInfo)
  })

  return {
    refresh(userInfo) {
      $el.html(`<img src="/assets/default.png" wdith="48" height="48" /><span class="ml-2 mr-2">${userInfo.UserName}</span> <span class="point logout">注销</span>`)
        .off('click')
        .on('click', '.logout', function (e) {
          if(!window.confirm('确定登出账号吗？')) return
          
          utils.DelLoaclStorageUserInfo('userinfo')
          Event.create('login').trigger('logOut', 'login')
        })
    }
  }
})($('.user-container'))