
// 头部模块
var header = (function ($el) {
  Event.create('header').listen('loginSuccess', function (userInfo) {
    header.refresh(userInfo)
  })

  return {
    refresh(userInfo) {
      $el.html(`<img src="/assets/default.png" wdith="48" height="48" /><span class="ml-2 mr-2">${userInfo.UserName}</span> <span class="mr-2 point modiyfPasswd">修改密码</span> <span class="point logout">注销</span>`)
        .off('click')
        .on('click', '.modiyfPasswd', function (e) {
          $('#modifypasswd-ModalCenter').off('click').on('click', '.modifypasswd-button', function (e) {
            let oldPassword = $('#modifypasswd-ModalCenter').find('#oldPasswd').val()
            let newPassword = $('#modifypasswd-ModalCenter').find('#newPasswd').val()
            let checkNewPassword = $('#modifypasswd-ModalCenter').find('#checkNewPasswd').val()
            if(!oldPassword) return alert('旧密码不能为空')
            if(!newPassword) return alert('新密码不能为空')
            if(!checkNewPassword) return alert('再次输入密码不能为空')
            if(newPassword !== checkNewPassword) return alert('再次输入密码不一致')
            var userInfo = utils.GetLoaclStorageUserInfo('userinfo')
            LOGIN_API.AdminEditPassword({ adminId: userInfo.AdminId, oldPassword, newPassword }).then(res => {
              alert(res.data.code)
              if (res.data.ret === 1001) {
                $('#modifypasswd-ModalCenter').modal('hide')
                utils.DelLoaclStorageUserInfo('userinfo')
                Event.create('login').trigger('logOut', 'login')
              }
            })
          })
          $('#modifypasswd-ModalCenter').modal('show')
        })
        .on('click', '.logout', function (e) {
          if(!window.confirm('确定登出账号吗？')) return
          
          utils.DelLoaclStorageUserInfo('userinfo')
          Event.create('login').trigger('logOut', 'login')
        })
    }
  }
})($('.user-container'))