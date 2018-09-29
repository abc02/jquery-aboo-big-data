
// 头部模块
var header = (function ($el) {
  Event.create('header').listen('loginSuccess', function (userInfo) {
    header.refresh(userInfo)
  })

  return {
    refresh(userInfo) {
      $el.html(`<img src="/assets/default.png" wdith="48" height="48" /><span class="ml-2 mr-2">${userInfo.UserName}</span>`)
    }
  }
})($('.user-container'))