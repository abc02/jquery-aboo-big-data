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
$('.bottom-doork').click(function () {
  $('.bottom-dialog').show()
  $(this).hide()
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
const $FIXING_NAV_TAB_CONTAINER = $('.nav-tab-container'),
  $FIXING_LIST_CONTAINER = $('.fixing-container'),
  $FIXING_PAGEINATION = $('#pagination'),
  $FIXING_NAV_SEARCH = $('.nav-search'),
  $LOGIN_FORM = $('.login-form'),
  $LOGIN_MODAL = $('#loginModal'),
  $USER_CONTAINER = $('.user-container')

function financial(x, num = 4) {
  return Number.parseFloat(x).toFixed(num);
}
function timestamp(date, isType) {
  if (!date) return ''
  if (String(date).length < 12) {
    date = Number.parseInt(date + '000')
  }
  let handleToYYYYMMDD = date => {
    let Year, Month, Day
    Year = date.getFullYear()
    Month = date.getMonth() + 1
    Day = date.getDate()
    return {
      YYYY: Year,
      MM: Month,
      DD: Day
    }
  }
  let handleToHHMMSSMS = date => {
    let Hours, Minutes, Seconds, Milliseconds
    Hours = date.getHours()
    Minutes = date.getMinutes()
    Seconds = date.getSeconds()
    Milliseconds = date.getMilliseconds()
    return {
      HH: Hours,
      MM: Minutes,
      SS: Seconds,
      MS: Milliseconds
    }
  }
  let handleToPad = (num, n = 2) => {
    if ((num + '').length >= n) return num
    return handleToPad('0' + num, n)
  }
  let YYYYMMDD = handleToYYYYMMDD(new Date(date))
  let HHMMSSMS = handleToHHMMSSMS(new Date(date))
  if (isType) {
    return `${YYYYMMDD.YYYY}-${handleToPad(YYYYMMDD.MM)}-${handleToPad(YYYYMMDD.DD)}`
  }
  return `${YYYYMMDD.YYYY}-${handleToPad(YYYYMMDD.MM)}-${handleToPad(YYYYMMDD.DD)} ${handleToPad(HHMMSSMS.HH)}:${handleToPad(HHMMSSMS.MM)}:${handleToPad(HHMMSSMS.SS)}`
}
axios.defaults.baseURL = 'https://datainterface.abpao.com/v1/xiedian_data'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.common[''] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZG1pbklkIjoiMyIsImV4cCI6MTUzODI4OTgwM30.YkXr2kW9F58d0Nt9EjHLp1NgHoTN4Ykg7iqTHYzMiug'


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
    window.alert(response.data.code)
    return null
  } 
  if (response.data.ret == 1003) {
    a.ClearLoaclStorageUserInfo()
    a._SetLoaclUserInfo(null)
    Event.trigger('setUserInfo')
    window.alert(response.data.code)
    $LOGIN_MODAL.modal('show')
    return null
  } 
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

//百度地图API功能
var map = (function (BMap) {
  let map = new BMap.Map("allmap");            // 创建Map实例
  let point = new BMap.Point(116.331398, 39.897445); // 默认北京
  let currentCity = new BMap.LocalCity();
  // let geoc = new BMap.Geocoder(); // 类用于获取用户的地址解析。
  let cityName
  map.centerAndZoom(point, 14);
  map.enableContinuousZoom(); // 启用连续缩放效果，默认禁用
  map.enableScrollWheelZoom();  // 启用滚轮放大缩小
  map.enableInertialDragging(); // 启用地图惯性拖拽，默认禁用
  currentCity.get(function (result) {
    cityName = result.name
    map.setCenter(cityName)
  })

  // 因此解决办法就是: 每次zoom完后自动平移下地图
  map.addEventListener('zoomend', function () {
    var p = map.getCenter();
    // 测试后得出的平移最小精度
    // 如果设置更小的精度就没有办法完成"小小平移下地图"的动作,
    // 有可能是百度地图做了平移的限制
    p.lng += 0.00001;
    try {
      // 地图在panTo的时候有可能出现异常
      map.panTo(p);
    } catch (e) {
      console.error(e.message);
    }
  });
  // map.addEventListener("tilesloaded", function () {//地图加载完毕
  //   let visibleMakers, makers, bs, bssw, bsne, b
  //   makers = map.getOverlays()
  //   bs = map.getBounds();   //获取可视区域
  //   bssw = bs.getSouthWest();   //可视区域左下角
  //   bsne = bs.getNorthEast();   //可视区域右上角
  //   b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat),new BMap.Point(bsne.lng, bsne.lat));
  //   visibleMakers = makers.map(maker => {
  //     if(b.containsPoint(maker.getPosition())) {
  //       return maker
  //     }
  //   })
  //   console.log(visibleMakers.length)
  //   $('.visible-maker').text(visibleMakers.length)
  //   //加载可视区域内已保存的标点
  //   //略...
  // });
  // //鼠标点击触发事件
  // map.addEventListener("click", function (e) {
  //   var pt = e.point; //获取标点
  //   geoc.getLocation(pt, function (rs) {
  //     //返回地址描述信息，是个字符串，比如：北京市丰台区海鹰路9号
  //     var add = rs.address;

  //     //返回结构化的地址描述信息，是个对象，返回省、市、县等信息
  //     var addComp = rs.addressComponents;
  //     //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);

  //     //判断标点所属城市，非本城市不允许标点
  //     if (addComp.city != cityName) {
  //       alert('只能在本城市范围内标点');
  //       return false;
  //     }
  //   });
  // })

  let size = new BMap.Size(10, 20);
  map.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,
    // 切换城市之间事件
    onChangeBefore: function () {
      console.log('before');
    },
    // 切换城市之后事件
    onChangeAfter: function (e) {
      console.log(map.getCurrentCity())
      console.log('after');
    }
  }));
  return map
}(BMap))