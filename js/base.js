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
  if (response.data.ret == 1002) {
    console.log(response)
    return response
  }
  if (response.data.ret == 1003) {
    return alert(response.data.code)
  }
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

$('.home-button').click(function () {
  $('.slider-dialog').toggle()
})
$('.conctrol-button').click(function () {
  $('.slider-dialog').toggle()
})
$('.slider-doork').click(function () {
  $('.slider-dialog').toggle()
})
$('.slider-close').click(function () {
  $('.slider-dialog').hide()
})
$('.bottom-doork-map').click(e => {
  $('.liveinfo-container').show()
  $(e.currentTarget).hide()
})
$('.bottom-doork-live').click(e => {
  $('.liveinfo-container').hide()
  $('.bottom-doork-map').show()
})
$('.bottom-doork-inner').click(function () {
  $('.bottom-dialog').hide()
  $('.bottom-doork').show()
})
$('.bottom-close').click(function () {
  $('.bottom-dialog').hide()
  $('.bottom-doork').show()
})

// el
const $LOGIN_FORM = $('.login-form'),
  $LOGIN_MODAL = $('#loginModal'),
  $DATEPICKER = $('#datepicker'),
  $STEPS = $('#steps'),
  $CALORIE = $('#calorie'),
  $WEIGHT = $('#weight'),
  $DISTANCE = $('#distance')