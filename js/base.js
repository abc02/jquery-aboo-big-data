function log () {
  console.log.apply(this, arguments)
}
// axios.defaults.baseURL = 'https://datainterface.abpao.com/v1/xiedian_data'
axios.defaults.baseURL = 'http://192.168.0.102:3000/v1/xiedian_data'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  var auths = ['AdminLoginAccount']
  // var { entity_name, latest_location } = fixinginfo
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
  if (response && response.data.ret === 1003) {
    // 返回 1003 清除token信息并跳转到登录页面
    localStorage.removeItem('userinfo')
    location.assign('/login.html')
  }
  return response
}, function (error) { 
  // Do something with response error
  return Promise.reject(error);
});
