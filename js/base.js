axios.defaults.baseURL = 'https://datainterface.abpao.com/v1/xiedian_data'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let auths = ['AdminLoginAccount']
  // let { entity_name, latest_location } = fixinginfo
  const RESULT = auths.every(auth => config.url.search(auth) > -1)
  if (!RESULT) {
    const USERINFO = JSON.parse(window.localStorage.getItem('userinfo'))
    if (USERINFO) {
      config.headers['Authorization'] = USERINFO.JwtToken
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

$('.slider-doork').click(e => {
  if ($(e.currentTarget).find('img').attr('src') === '/assets/extension.png') {
    $(e.currentTarget).find('img').attr('src', '/assets/extension_select.png')
  } else {
    $(e.currentTarget).find('img').attr('src', '/assets/extension.png')
  }
  $('.slider-dialog').toggle()
})
$('.bottom-doork-map').click(e => {
  $('.liveinfo-container').show()
  $(e.currentTarget).hide()
})
$('.bottom-doork-live').click(e => {
  $('.liveinfo-container').hide()
  $('.bottom-doork-map').show()
})