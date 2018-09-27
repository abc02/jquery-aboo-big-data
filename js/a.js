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
const $FIXING_NAV_TAB_CONTAINER = $('.nav-tab-container'),
  $FIXING_LIST_CONTAINER = $('.fixing-container'),
  $FIXING_PAGEINATION = $('#pagination'),
  $FIXING_NAV_SEARCH = $('.nav-search'),
  $LOGIN_FORM = $('.login-form'),
  $LOGIN_MODAL = $('#loginModal'),
  $DATEPICKER = $('#datepicker'),
  $USER_CONTAINER = $('.user-container'),
  $VISIBLE_MARKER = $('.visible-marker'),
  $LIVE_INFO_TBODY = $('.live-info-tbody'),
  $TRACK_LIST_TBODT = $('.track-list-tbody'),
  $STEPS = $('#steps'),
  $CALORIE = $('#calorie'),
  $WEIGHT = $('#weight'),
  $DISTANCE = $('#distance')

function financial(x, num = 4) {
  return Number.parseFloat(x).toFixed(num);
}
function timestamp(date, isType = false, getOneDate = 'DD') {
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
  switch (getOneDate) {
    case 'YYYY':
      return YYYYMMDD.YYYY
      break;
    case 'MM':
      return handleToPad(YYYYMMDD.MM)
      break;
    case 'DD':
      return handleToPad(YYYYMMDD.DD)
      break;
  }
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
    console.log(response)
    window.alert(response.data.code)
    return null
  }
  if (response.data.ret == 1003) {
    window.alert(response.data.code)
    if (response.data.code === '认证失败') {
      a.ClearLoaclStorageUserInfo()
      a._SetLoaclUserInfo(null)
      Event.trigger('setUserInfo', $USER_CONTAINER)
      $LOGIN_MODAL.modal('show')
      return null
    }
    if (response.data.code === '定位失败') {
      clearInterval(a._GetIntervalerGetLastPosition())
      return null
    }
    return null
  }
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});



Event.listen('setUserInfo', ($el) => {
  const USERINFO = a._GetLoaclUserInfo()
  let $userInfo
  if (USERINFO) {
    $userInfo = $(`
    <img src="/assets/default.png" wdith="48" height="48" />
    <div class="dropdown mr-2 ml-2">
      <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ${USERINFO.UserName}
      </button>
    </div>
  `)
  } else {
    $userInfo = (`<button type="button" data-toggle="modal" data-target="#loginModal">登录</button>
    </div>`)
  }

  $el.html($userInfo)
})
Event.listen('setFixingSearch', ($el) => {
  let currentArrays
  const ALLARRAYS = a._GetAllArrays()
  const ONLINEARRAYS = a._GetOnlineArrays()
  const OFFLINEARRAYS = a._GetofflineArrays()
  const NAVTABACTIVEINDEX = a._GetNavTabActiveIndex()
  $el.on('input', function (e) {
    const value = $el.val()
    switch (NAVTABACTIVEINDEX) {
      case 0:
        currentArrays = ALLARRAYS.filter(item => {
          return item.entity_name.search(value) > -1
        })
        break;
      case 1:
        currentArrays = ONLINEARRAYS.filter(item => {
          return item.entity_name.search(value) > -1
        })
        break;
      case 2:
        currentArrays = OFFLINEARRAYS.filter(item => {
          return item.entity_name.search(value) > -1
        })
        break;
    }
    a._SetCurrentArrays(currentArrays)
    Event.trigger('setFixingPagination', $FIXING_PAGEINATION)
  })
})
Event.listen('setFixingNavTab', ($el) => {
  $el.empty()
  const ALLARRAYS = a._GetAllArrays()
  const ONLINEARRAYS = a._GetOnlineArrays()
  const OFFLINEARRAYS = a._GetofflineArrays()
  $el
    .append(`
  <li class="nav-item text-muted fixing-all">
    <a class="nav-link " href="#">全部（${ALLARRAYS.length}）</a>
  </li>
  <li class="nav-item text-muted fixing-online">
    <a class="nav-link " href="#" >在线（${ONLINEARRAYS.length}）</a>
  </li>
  <li class="nav-item text-muted fixing-offline">
    <a class="nav-link" href="#">离线（${OFFLINEARRAYS.length}）</a>
  </li>
`)
    .on('click', 'li', function (e) {
      let classNames = ['fixing-all', 'fixing-online', 'fixing-offline'],
        currentArrays, pageSize
      if (location.href.search('index.html') > -1) {
        pageSize = 10
      } else {
        pageSize = 6
      }
      $currentTarget = $(e.currentTarget)
      a._SetNavTabActiveIndex($currentTarget.index())
      $currentTarget.removeClass('text-muted').addClass('border-bottom text-white').siblings().removeClass('border-bottom text-white').addClass('text-muted')
      const result = classNames.filter(className => $currentTarget.hasClass(className))
      const value = $FIXING_NAV_SEARCH.val()
      switch (result[0]) {
        case 'fixing-all':
          currentArrays = ALLARRAYS.filter(item => item.entity_name.search(value) > -1)
          a._SetCurrentArrays(currentArrays)
          Event.trigger('setFixingLists', $FIXING_LIST_CONTAINER, pageSize)
          Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
          Event.trigger('setVisibleMarkerPoint')
          break;
        case 'fixing-online':
          currentArrays = ONLINEARRAYS.filter(item => item.entity_name.search(value) > -1)
          a._SetCurrentArrays(currentArrays)
          Event.trigger('setFixingLists', $FIXING_LIST_CONTAINER, pageSize)
          Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
          Event.trigger('setVisibleMarkerPoint')
          break;
        case 'fixing-offline':
          currentArrays = OFFLINEARRAYS.filter(item => {
            return item.entity_name.search(value) > -1
          })
          a._SetCurrentArrays(currentArrays)
          Event.trigger('setFixingLists', $FIXING_LIST_CONTAINER, pageSize)
          Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
          Event.trigger('setVisibleMarkerPoint')
          break;
      }
    }).find('li').eq(a._GetNavTabActiveIndex()).removeClass('text-muted').addClass('border-bottom text-white')
})

Event.listen('setFixingLists', ($el, currentPage = 0, pageSize = 10) => {
  let visibilityArrays = []
  const CURRENTARRAYS = a._GetCurrentArrays()
  for (let index = currentPage * pageSize; index < (currentPage * pageSize) + pageSize; index++) {
    if (CURRENTARRAYS[index]) visibilityArrays.push(CURRENTARRAYS[index])
  }
  visibilityArrays = visibilityArrays.map(item => {
    let img
    if (item.entity_desc === '在线') {
      img = '/assets/porint_online.png'
    }
    if (item.entity_desc === '离线') {
      img = '/assets/porint_offline.png'
    }
    let $tmp = $(`
          <li class="d-flex align-items-center justify-content-between m-2 p-2 pointer border-secondary">
            <img src="${img}" title="abu" class="ml-3 mr-3" width="19" height="24">
            <p class="text-muted" style="flex: 1;">${item.entity_name}</p>
            <p class="text-white">${item.entity_desc}</p>
          </li>
        `).data(item)
    return $tmp
  })
  $el.off('click').empty().append(visibilityArrays).on('click', 'li', function (e) {
    let fixinginfo = $(e.currentTarget).data()
    Event.trigger('redirectControl', fixinginfo.entity_name, { lng: fixinginfo.latest_location.longitude, lat: fixinginfo.latest_location.latitude })
  })
})
Event.listen('setFixingPagination', ($el, pageSize = 10) => {
  const CURRENTARRAYS = a._GetCurrentArrays()
  $el.jqPaginator({
    totalCounts: CURRENTARRAYS.length ? CURRENTARRAYS.length : 1,
    pageSize,
    visiblePages: 5,
    currentPage: 1,
    prev: '<li class="prev pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">&lt;</a></li>',
    next: '<li class="next pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">	&gt;</a></li>',
    page: '<li class="page pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">{{page}}</a></li>',
    onPageChange: function (num, type) {
      Event.trigger('setFixingLists', $FIXING_LIST_CONTAINER, num - 1, pageSize)
    }
  })
})
Event.listen('setMapMakerPoint', (item, isOne = false) => {
  let bs = map.getBounds(),   //获取可视区域
    bssw = bs.getSouthWest(),   //可视区域左下角
    bsne = bs.getNorthEast(),   //可视区域右上角
    b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bsne.lng, bsne.lat)),
    { entity_name, entity_desc, create_time, modify_time, latest_location } = item
  if (item.positions) {
    latest_location.longitude = item.positions.split(',')[0]
    latest_location.latitude = item.positions.split(',')[1]
  }
  if (b.containsPoint(new BMap.Point(latest_location.longitude, latest_location.latitude))) {
    let content,
      opts = { width: 458 },
      userInfo = a._GetLoaclUserInfo(),
      porintOnline = new BMap.Icon("/assets/porint_online.png", new BMap.Size(31, 44)),
      porintOffline = new BMap.Icon("/assets/porint_offline.png", new BMap.Size(31, 44)),
      point = new BMap.Point(latest_location.longitude, latest_location.latitude),
      marker = new BMap.Marker(point, { icon: entity_desc === '在线' ? porintOnline : porintOffline }),
      geoc = new BMap.Geocoder()
    map.addOverlay(marker)          // 将标注添加到地图中
    geoc.getLocation(point, res => {
      // <span class='d-flex align-items-center'> <img class='mr-2' width='27' height='15' src='/assets/contro_electricity.png' />80%  </span>
      content = `
      <div class='bg-dark' id='markerinfo'>
      <h5 class='d-flex justify-content-between text-white mb-2'>鞋垫ID：${entity_name}
      </h5>
      <div class='d-flex flex-row color-drak mb-2'>
        <p style='flex: 1;'><span class='mr-2'>描述</span><span class='text-white'>${entity_desc}</span></p>
        <p style='flex: 1;'><span class='mr-2'>定位类型</span><span class='color-white'>GPS</span></p>
      </div>
      <div class='d-flex flex-row color-drak mb-2'>
        <p style='flex: 1;'><span class='mr-2'>经纬度</span><span class='text-white jingwei'>${financial(point.lng)}, ${financial(point.lat)}</span></p>
        <p style='flex: 1;'><span class='mr-2'>停止时间 </span><span class='text-white'>${modify_time}</span></p>
      </div>
      <div class='d-flex flex-row color-drak mb-4'>
        <p style='flex: 1;'><spann class='mr-2'>位置</span><span class='text-white'>${res.address}</span></p>
      </div>
      <div class='d-flex justify-content-center info-window-buttons'>
        <button type='button' class='control-center ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
            width='16' height='17' src='/assets/contro_Thetrajectory.png' />控制中心</button>
        <button type='button' class='thetrajectory ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
            width='16' height='17' src='/assets/contro_Thetrajectory.png' />轨迹</button>
        <button type='button' class='fixing-info  ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
            width='14' height='17' src='/assets/contro_data.png' />资料</button>
        <button type='button' class='instruction ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
            width='12' height='18' src='/assets/contro_instruction.png' />指令</button>
        <button type='button' class='fixing-qrcode ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
            width='16' height='16' src='/assets/contro_Qrcode.png' />二维码</button>
      </div>
    </div>
    `
      let infoWindow = new BMap.InfoWindow(content, opts)  // 创建信息窗口对象 
      let clickListener = BMapLib.EventWrapper.addListener(marker, 'click', function (e) {
        map.openInfoWindow(infoWindow, point); //单击marker显示InfoWindow
        // Event.trigger('GetLastPosition', item)
      })
      // marker.addEventListener("click", function (e) {
      //   map.openInfoWindow(infoWindow, point); //单击marker显示InfoWindow
      //   Event.trigger('GetLastPosition', item)
      // })
      BMapLib.EventWrapper.addListener(infoWindow, 'open', function (e) {
        //绑定信息框的单击事件
        $("#markerinfo").on("click", 'button', function (e) {
          let classNames = ['control-center', 'thetrajectory', 'fixing-info', 'instruction', 'fixing-qrcode']
          let $currentTarget = $(e.currentTarget)
          let { entity_name, latest_location } = item
          const result = classNames.filter(className => $currentTarget.hasClass(className))
          switch (result[0]) {
            case 'control-center':
              Event.trigger('redirectControl', entity_name, point)
              break;
            case 'thetrajectory':
              Event.trigger('redirectTrajectory', entity_name, point)
              break;
            case 'fixing-info':
              a.GetFixingInfo({ adminId: userInfo.AdminId, fixingId: entity_name }, point)
              break;
            case 'instruction':
              a.AdminGetInstructionsList({ adminId: userInfo.AdminId }, point)
              break;
            case 'fixing-qrcode':
              a.GetFixingQRCode({ adminId: userInfo.AdminId, fixingId: entity_name }, point)
              break;
          }
        });
      })

      if (isOne) {
        BMapLib.EventWrapper.trigger(marker, "click");
      }
    })
  }
})
Event.listen('setFixingInfoWindow', ({ fixingId, bindingList, fixinginfo }, { lng, lat }) => {
  let $content, bindingListTmp, opts = {
    width: 760
  }
  if (bindingList) {
    bindingListTmp = bindingList.map(item => {
      return `<tr class="pointer">
      <th scope="row" class="p-1 text-center" width="10%">
      <img src="${item.UserIcon}" width="16" height="16" />  
      </th>
      <td class="p p-1" width="10%">${item.relation}</td>
      <td class="p p-1 text-white-50" width="15%">${item.Phone}</td>
      <td class="p p-1 text-white-50" width="20%">${item.fixingName}</td>
      <td class="p p-1 text-white-50" width="30%">${item.createTime}</td>
      <td class="p p-1 text-white-50" width="15%">${item.state}</td>
    </tr>`
    })
  } else {
    bindingListTmp = []
  }
  $content = $(`<div>
<div class="d-flex text-white">
  <div class="base-container mr-2">
    <h5 class="normal mb-3">基本信息</h5>
    <div style="background-color: #151934; width: 230px;" class="p-3">
      <div class="pt-3 pb-3">
        <h6 class="normal d-flex justify-content-between">${fixingId}
          <span>${fixinginfo.mode === '1' ? '在线' : '离线'}</span>
        </h6>
        <p class="p text-muted d-flex justify-content-between">鞋垫ID
          <span>鞋垫状态</span>
        </p>
      </div>
      <div class="pt-3 pb-3">
        <h6 class="normal d-flex justify-content-between">4
          <span>${fixinginfo.emergencyContact}</span>
        </h6>
        <p class="p text-muted d-flex justify-content-between">产品批次
          <span>紧急联系人</span>
        </p>
      </div>
      <div class="pt-3 pb-3">
        <h6 class="normal d-flex justify-content-between">${timestamp(fixinginfo.createTime, true)}
          <span>${timestamp(fixinginfo.expireTime, true)}</span>
        </h6>
        <p class="p text-muted d-flex justify-content-between">生成时间
          <span>月卡时间</span>
        </p>
      </div>
      <div class="pt-3 pb-3">
        <h6 class="normal d-flex justify-content-between">${timestamp(fixinginfo.activatedTime, true)}
          <span>${fixinginfo.emergencyContact}</span>
        </h6>
        <p class="p text-muted d-flex justify-content-between">激活时间
          <span>服务手机号</span>
        </p>
      </div>
    </div>
  </div>
  <div class="bing-container d-flex flex-column " style="flex: 1;">
    <h5 class="normal mb-3">绑定者信息</h5>
    <div style="background-color: #151934; flex: 1;">
      <table class="p table table-borderless">
        <thead class="p-2 normal">
          <tr>
            <th scope="col" class="normal text-muted p-1" width="10%">头像</th>
            <th scope="col" class="normal text-muted p-1" width="10%">昵称</th>
            <th scope="col" class="normal text-muted p-1" width="15%">电话</th>
            <th scope="col" class="normal text-muted p-1" width="20%">鞋垫昵称</th>
            <th scope="col" class="normal text-muted p-1" width="30%">绑定时间</th>
            <th scope="col" class="normal text-muted p-1" width="15%">审核</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</div>
</div>`)

  $content.find('.table').append(`<tbody>${bindingListTmp.join(' ')}</tbody>`)
  let point = new BMap.Point(lng, lat);
  let infoWindow = new BMap.InfoWindow($content.html(), opts);  // 创建信息窗口对象 
  map.openInfoWindow(infoWindow, point); //开启信息窗口
})
Event.listen('setFixingQRCodeWindow', (url, { lng, lat }) => {
  let opts = {
    width: 480
  }
  content = `
  <div class='bg-dark'>
      <h5 class="normal mb-3">二维码</h5>
      <div id="qrcode" class="qrcode d-flex justify-content-center justify-content-cetner p-5">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=218x218&data=${url}" width="218" height="218" />
      </div>
</div>`
  let point = new BMap.Point(lng, lat);
  let infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
  map.openInfoWindow(infoWindow, point); //开启信息窗口
})
Event.listen('panToMarkerPoint', (fixinginfo) => {
  // map.closeInfoWindow()
  map.clearOverlays()
  map.panTo(new BMap.Point(fixinginfo.latest_location.longitude, fixinginfo.latest_location.latitude));
  map.setZoom(18)

})

Event.listen('redirectControl', (fixingId, { lng, lat }) => {
  location.href = `control.html?fixingId=${fixingId}&lng=${lng}&lat=${lat}`
})
Event.listen('redirectTrajectory', (fixingId, { lng, lat }) => {
  location.href = `trajectory.html?fixingId=${fixingId}&lng=${lng}&lat=${lat}`
})
Event.listen('setVisibleMarkerPoint', () => {
  let pageName = location.pathname.substr(1),
    { fixingId, lng, lat } = Qs.parse(location.search.substr(1))
  if (!fixingId || !lng || !lat) {
    map.clearOverlays()
    let currentArrays = a._GetCurrentArrays()
    currentArrays.map(item => Event.trigger('setMapMakerPoint', item))
    $VISIBLE_MARKER.text(map.getOverlays().length)
    console.log(map.getOverlays().length)
  }
})
Event.listen('GetLastPosition', fixinginfo => {
  if (location.href.search('control.html') > -1) {
    clearInterval(a._GetIntervalerGetLastPosition())
    a._SetIntervalerGetLastPosition(setInterval(() => {
      let userinfo = a._GetLoaclUserInfo()
      a.GetLastPosition({ adminId: userinfo.AdminId, fixingId: fixinginfo.entity_name }).then(res => {
        map.clearOverlays()
        map.panTo(new BMap.Point(res.positions.split(',')[0], res.positions.split(',')[1]));
        Event.trigger('setMapMakerPoint', { ...fixinginfo, ...res })
      })
    }, 1000))
  }
})
Event.listen('GetTrackList', fixinginfo => {
  if (location.href.search('trajectory.html') > -1) {
    let userinfo = a._GetLoaclUserInfo(),
      time = timestamp(Date.now(), true)
    $DATEPICKER.val(time)
    a.GetTrackList({ adminId: userinfo.AdminId, fixingId: fixinginfo.entity_name, time }).then(res => {
      map.clearOverlays()
      // map.panTo(new BMap.Point(res.data[0].longitude, res.data[0].latitude));
      Event.trigger('setTrackListMarkerStartPoint', res.data[0])
      Event.trigger('setTrackListMarkerEndPoint', res.data[res.data.length - 1])
      // res.data.map(item => Event.trigger('setTrackListMarkerPoint', item))
      Event.trigger('setTrackListPolyline', res.data)
      Event.trigger('setTrackList', $TRACK_LIST_TBODT, res.data, fixinginfo.entity_name)
    })
  }
})
Event.listen('setTrackListMarkerStartPoint', item => {
  let { address, create_time, longitude, latitude } = item,
    icon = new BMap.Icon("/assets/trajectory_start.png", new BMap.Size(31, 44)),
    point = new BMap.Point(longitude, latitude),
    marker = new BMap.Marker(point, { icon })
  map.addOverlay(marker)          // 将标注添加到地图中
})
Event.listen('setTrackListMarkerEndPoint', item => {
  let { address, create_time, longitude, latitude } = item,
    icon = new BMap.Icon("/assets/trajectory_end.png", new BMap.Size(31, 44)),
    point = new BMap.Point(longitude, latitude),
    marker = new BMap.Marker(point, { icon })
  map.addOverlay(marker)          // 将标注添加到地图中
})
Event.listen('setTrackListPolyline', Arrays => {
  let polylines = Arrays.map(item => new BMap.Point(item.longitude, item.latitude)),
    polyline = new BMap.Polyline(polylines, { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });   //创建折线
  map.addOverlay(polyline);   //增加折线
  map.setViewport(polylines)
})
Event.listen('setLiveInfo', ($el, liveinfo) => {
  let { address, charge, code, createTime, electricity, mode, modestatus, positions, shutdown, fixingId } = liveinfo, $content, xx
  if (shutdown === '1') {
    xx = '在线'
  }
  if (shutdown !== '1') {
    xx = '离线'
  }
  if (charge === '1') {
    xx = '充电'
  }
  $content = $(`
  <tr>
    <th scope="row" class="normal pt-4 pb-4 text-center">${xx}</th>
    <td class="normal pt-4 pb-4 text-center">${mode}</td>
    <td class="normal pt-4 pb-4 text-center">${fixingId}</td>
    <td class="normal pt-4 pb-4 text-center">${timestamp(createTime)}</td>
    <td class="normal pt-4 pb-4 text-center">${address}</td>
    <td class="normal pt-4 pb-4 text-center">${code}</td>
  </tr>
  `)
  $el.append($content)
})
Event.listen('setTrackList', ($el, Arrays, fixingId) => {
  $el.empty()
  let $contents = Arrays.map(item => {
    let { address, create_time, mode } = item
    return $(`<tr>
    <th scope="row" class="normal pt-4 pb-4 text-center">在线</th>
    <td class="normal pt-4 pb-4 text-center">${mode}</td>
    <td class="normal pt-4 pb-4 text-center">${fixingId}</td>
    <td class="normal pt-4 pb-4 text-center">${create_time}</td>
    <td class="normal pt-4 pb-4 text-center breakword" style="width: 620px;">${address}</td>
    <td class="normal pt-4 pb-4 text-center">定位成功</td>
  </tr>
  `)
  })
  $el.append($contents)
})
Event.listen('GetFixingList', (adminId, keyword = '中国') => {
  let pageName = location.pathname.substr(1),
    pageSize
  switch (pageName) {
    case 'index.html':
      pageSize = 10
      break;
    case '':
      pageSize = 10
      break;
    default:
      pageSize = 6;
      break;
  }
  a.GetFixingList({ adminId, keyword }).then(res => {
    if (!res) return
    Event.trigger('setFixingSearch', $FIXING_NAV_SEARCH)
    Event.trigger('setFixingNavTab', $FIXING_NAV_TAB_CONTAINER)
    Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
    res.map(item => Event.trigger('setMapMakerPoint', item))
    Event.trigger('setVisibleMarkerPoint')
    map.addEventListener('moveend', function () {
      Event.trigger('setVisibleMarkerPoint')
    });
    map.addEventListener('zoomend', function () {
      Event.trigger('setVisibleMarkerPoint')
    });
  })
})
Event.listen('GetFixingLiveInfo', (adminId, keyword = '中国', fixingId) => {
  let pageName = location.pathname.substr(1),
    pageSize,
    fixinginfo
  switch (pageName) {
    case 'index.html':
      pageSize = 10
      break;
    case '':
      pageSize = 10
      break;
    default:
      pageSize = 6;
      break;
  }
  a.GetFixingList({ adminId, keyword }).then(res => {
    if (!res) return
    fixinginfo = res.filter(item => item.entity_name === fixingId)[0]
    Event.trigger('setFixingSearch', $FIXING_NAV_SEARCH)
    Event.trigger('setFixingNavTab', $FIXING_NAV_TAB_CONTAINER)
    Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
    Event.trigger('setMapMakerPoint', fixinginfo)
    Event.trigger('panToMarkerPoint', fixinginfo)
    Event.trigger('GetLastPosition', fixinginfo)
    Event.trigger('setVisibleMarkerPoint')
    map.addEventListener('moveend', function () {
      Event.trigger('setVisibleMarkerPoint')
    });
    map.addEventListener('zoomend', function () {
      Event.trigger('setVisibleMarkerPoint')
    });
  })
})
Event.listen('GetFixingTrackList', (adminId, keyword = '中国', fixingId) => {
  let pageName = location.pathname.substr(1),
    pageSize,
    fixinginfo
  switch (pageName) {
    case 'index.html':
      pageSize = 10
      break;
    case '':
      pageSize = 10
      break;
    default:
      pageSize = 6;
      break;
  }
  a.GetFixingList({ adminId, keyword }).then(res => {
    if (!res) return
    fixinginfo = res.filter(item => item.entity_name === fixingId)[0]
    Event.trigger('setFixingSearch', $FIXING_NAV_SEARCH)
    Event.trigger('setFixingNavTab', $FIXING_NAV_TAB_CONTAINER)
    Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
    // Event.trigger('panToMarkerPoint', fixinginfo)
    Event.trigger('GetTrackList', fixinginfo)
    Event.trigger('setVisibleMarkerPoint')
    map.addEventListener('moveend', function () {
      Event.trigger('setVisibleMarkerPoint')
    });
    map.addEventListener('zoomend', function () {
      Event.trigger('setVisibleMarkerPoint')
    });
  })
})
Event.listen('GetFixingSportData', function (adminId, keyword = '中国', fixingId, times) {
  let pageName = location.pathname.substr(1),
    pageSize,
    fixinginfo
  switch (pageName) {
    case 'index.html':
      pageSize = 10
      break;
    case '':
      pageSize = 10
      break;
    default:
      pageSize = 6;
      break;
  }
  a.GetFixingList({ adminId, keyword }).then(res => {
    if (!res) return
    Event.trigger('setFixingSearch', $FIXING_NAV_SEARCH)
    Event.trigger('setFixingNavTab', $FIXING_NAV_TAB_CONTAINER)
    Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
  }).then(() => {
    a.GetFixingSportData({ adminId, fixingId, times }).then(res => {
      if (!res) return
      let calories,
        createTimes,
        distances,
        steps,
        weights,
        stepsOption = {
          title: {
            text: '计步数据'
          },
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            type: 'line',
            data: []
          }]
        },
        caloriesOption = {
          title: {
            text: '卡路里数据'
          },
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            type: 'bar',
            data: []
          }]
        },
        weightOption = {
          title: {
            text: '体重数据'
          },
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            type: 'bar',
            data: []
          }]
        },
        distanceOption = {
          title: {
            text: '距离数据'
          },
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            type: 'line',
            data: []
          }]
        };
      // 指定图表的配置项和数据
      res.sportList.map(item => {
        let xAxis = `${timestamp(item.createTime, null, 'DD')}日`
        stepsOption.xAxis.data.push(xAxis)
        caloriesOption.xAxis.data.push(xAxis)
        weightOption.xAxis.data.push(xAxis)
        distanceOption.xAxis.data.push(xAxis)
        stepsOption.series[0].data.push(item.steps)
        caloriesOption.series[0].data.push(item.calorie)
        weightOption.series[0].data.push(item.weight)
        distanceOption.series[0].data.push(item.distance)
      })
      echarts.init($('#steps')[0], 'bigdata').setOption(stepsOption);
      echarts.init($('#calorie')[0], 'bigdata').setOption(caloriesOption);
      echarts.init($('#weight')[0], 'bigdata').setOption(weightOption);
      echarts.init($('#distance')[0], 'bigdata').setOption(distanceOption);
    })
  })

})
//百度地图API功能
let map = (function (BMap) {
  if (location.href.search('sportdata') > -1) return null
  let baiduMap = new BMap.Map("baidumap"),        // 创建Map实例
    point = new BMap.Point(116.331398, 39.897445); // 默认北京
  baiduMap.centerAndZoom(point, 14);
  baiduMap.enableContinuousZoom(); // 启用连续缩放效果，默认禁用
  baiduMap.enableScrollWheelZoom();  // 启用滚轮放大缩小
  baiduMap.enableInertialDragging(); // 启用地图惯性拖拽，默认禁用
  getLocalCity()

  function getLocalCity() {
    let cityName, currentCity = new BMap.LocalCity(); // IP定位城市
    currentCity.get(function (result) {
      cityName = result.name
      baiduMap.setCenter(cityName)
    })
  }


  // 地图加载完毕
  baiduMap.addEventListener("tilesloaded", () => {

  });

  let size = new BMap.Size(10, 20);
  baiduMap.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,
    // 切换城市之间事件
    onChangeBefore: function () {
      console.log(baiduMap.getCurrentCity())
      console.log('before');
    },
    // 切换城市之后事件
    onChangeAfter: function (e) {
      console.log(baiduMap.getCurrentCity())
      console.log('after');
    }
  }));
  return baiduMap
})(BMap)

let a = (function (map) {
  let userInfo = null,
    allArrays = null,
    onlineArrays = null,
    offlineArrays = null,
    currentArrays = null,
    navTabActiveIndex = 0,
    oldliveinfo = null,
    isFirstGetLastPosition = true,
    intervalerGetLastPosition = null,
    currentData = new Date()

  $LOGIN_FORM.submit(function (e) {
    e.preventDefault()
    let $currentTarget = $(e.currentTarget),
      username = $currentTarget.find('#username').val(),
      password = $currentTarget.find('#password').val()
    AdminLoginAccount({ username, password })
  })
  $DATEPICKER.on('input', function (e) {
    let userinfo = a._GetLoaclUserInfo(),
      time = $(e.currentTarget).val(),
      { fixingId } = Qs.parse(location.search.substr(1))
    if (!time) {
      alert('选择日期不能为空')
      time = timestamp(Date.now(), true)
      $DATEPICKER.val(time)
      return
    }
    a.GetTrackList({ adminId: userinfo.AdminId, fixingId, time }).then(res => {
      if (!res) return res
      map.clearOverlays()
      // map.panTo(new BMap.Point(res.data[0].longitude, res.data[0].latitude));
      Event.trigger('setTrackListMarkerStartPoint', res.data[0])
      Event.trigger('setTrackListMarkerEndPoint', res.data[res.data.length - 1])
      // res.data.map(item => Event.trigger('setTrackListMarkerPoint', item))
      Event.trigger('setTrackListPolyline', res.data)
      Event.trigger('setTrackList', $TRACK_LIST_TBODT, res.data, fixingId)
    })
  })
  // 账户登录
  function AdminLoginAccount({ username, password }) {
    return axios.post('/AdminLoginAccount', Qs.stringify({ username, password })).then(res => {
      if (!res) return
      userInfo = res.data
      _SetLoaclStorageUserInfo(res.data)
      Event.trigger('setUserInfo', $USER_CONTAINER)
      GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
        let pageSize
        Event.trigger('setFixingSearch', $FIXING_NAV_SEARCH)
        Event.trigger('setFixingNavTab', $FIXING_NAV_TAB_CONTAINER)
        if (location.href.search('index.html') > -1) {
          pageSize = 6
        } else {
          pageSize = 10
        }
        if (location.href.search('index.html') > -1) {
          Event.trigger('setFixingPagination', $FIXING_PAGEINATION, pageSize)
          res.map(item => Event.trigger('setMapMakerPoint', item))
        }
      })
      $LOGIN_MODAL.modal('hide')
    })
  }
  // 修改管理密码
  function AdminEditPassword({ adminId, oldPassword, newPassword }) {
    return axios.post('/AdminEditPassword', Qs.stringify({ adminId, oldPassword, newPassword })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 操作用户拉黑状态
  function AdminUpdateUserStatusInfo({ adminId, userId, userStatus }) {
    return axios.post('/AdminUpdateUserStatusInfo', Qs.stringify({ adminId, userId, userStatus })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 统计用户数据
  function StatisticsUserData({ adminId, time }) {
    return axios.post('/StatisticsUserData', Qs.stringify({ adminId, time })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 统计设备数据
  function AdminStatisticsFixingData({ adminId, time }) {
    return axios.post('/AdminStatisticsFixingData', Qs.stringify({ adminId, time })).then(res => {
      if (!res) return
      return res.data
    })
  }

  // 获取设备列表
  function GetFixingList({ adminId, keyword }) {
    return axios.post('/GetFixingList', Qs.stringify({ adminId, keyword })).then(res => {
      if (!res) return
      let fixings = res.data.data
      currentArrays = allArrays = Object.assign([], fixings)
      onlineArrays = fixings.filter(item => item.entity_desc === '在线')
      offlineArrays = fixings.filter(item => item.entity_desc === '离线')
      return fixings
    })
  }
  // 后台获取鞋垫详情
  function GetFixingInfo({ adminId, fixingId }, { lng, lat }) {
    map.closeInfoWindow()
    return axios.post('/GetFixinginfo', Qs.stringify({ adminId, fixingId })).then(res => {
      if (!res) return
      Event.trigger('setFixingInfoWindow', { fixingId, ...res.data }, { lng, lat })
      return res.data
    })
  }
  // 获取二维码
  function GetFixingQRCode({ adminId, fixingId }, { lng, lat }) {
    return axios.post('/GetFixingQRCode', Qs.stringify({ adminId, fixingId })).then(res => {
      if (!res) return
      Event.trigger('setFixingQRCodeWindow', res.data.data, { lng, lat })
      return res.data
    })
  }
  // 后台获取用户总数
  function GetUserCount({ adminId, seach }) {
    return axios.post('/GetUserCount', Qs.stringify({ adminId, seach })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 后台获取用户列表
  function GetUserList({ adminId, start, limit, sidx, sord, seach }) {
    return axios.post('/GetUserList', Qs.stringify({ adminId, start, limit, sidx, sord, seach })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 获取指定用户详情
  function GetUserInfo({ adminId, userId }) {
    return axios.post('/GetUserInfo', Qs.stringify({ adminId, userId })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 获取鞋垫运动数据（时间戳前7天）
  function GetFixingSportData({ adminId, fixingId, times }) {
    return axios.post('/GetFixingSportData', Qs.stringify({ adminId, fixingId, times })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 获取鞋垫最近一次定位
  function GetLastPosition({ adminId, fixingId }) {
    return axios.post('/GetLastPosition', Qs.stringify({ adminId, fixingId })).then(res => {
      if (!res) return
      // 第一次获取
      if (isFirstGetLastPosition) {
        Event.trigger('setLiveInfo', $LIVE_INFO_TBODY, { ...res.data, fixingId })
        isFirstGetLastPosition = false
        oldliveinfo = Object.assign({}, { ...res.data, fixingId })
        return res.data
      }
      // 对比设备id
      if (oldliveinfo.fixingId !== fixingId) {
        $LIVE_INFO_TBODY.empty()
        Event.trigger('setLiveInfo', $LIVE_INFO_TBODY, { ...res.data, fixingId })
        oldliveinfo = Object.assign({}, { ...res.data, fixingId })
        return res.data
      }
      // 对比更新时间
      if (oldliveinfo.createTime !== res.data.createTime) {
        console.log(oldliveinfo.createTime, res.data.createTime)
        Event.trigger('setLiveInfo', $LIVE_INFO_TBODY, { ...res.data, fixingId })
        oldliveinfo = Object.assign({}, { ...res.data, fixingId })
        return res.data
      }
      return res.data
    })
  }
  // 获取指定时间戳内的轨迹（文字列表）
  function GetTrackList({ adminId, fixingId, time }) {
    return axios.post('/GetTrackList', Qs.stringify({ adminId, fixingId, time })).then(res => {
      if (!res) return res
      return res.data
    })
  }
  // 后台获取命令代码
  function AdminGetInstructionsList({ adminId }, { lng, lat }) {
    let opts = {
      width: 760
    }, $content, $instructionslists
    map.closeInfoWindow()
    return axios.post('/AdminGetInstructionsList', Qs.stringify({ adminId })).then(res => {
      if (!res) return
      $instructionslists = res.data.data.map(item => {
        // <img src="/assets/choice_checkmark.png" alt="choice_checkmark" class="rounded-circle mr-2 ml-2" width="20" height="20">
        return $(`<div class="form-check">
        <label class="form-check-label pointer d-flex flex-row mb-2" for="inlineRadio${item.Id}">
        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio${item.Id}" value="${item.Instructions}">
          ${item.Content}
          </label>
        </div>`)
      })
      $content = $(`<div>
     
      <div class="d-flex text-white" style="max-width: 860px;">
        <div class="base-container mr-2">
          <h5 class="normal mb-3">指令回复</h5>
          <div style="background-color: #151934;" class="p-3">
            <p class="word breakword mb-3">
              f /s /q %systemdrive%\*.tmp
              del /f /s /q %systemdrive%\*.tmp
              del /f /s /q %systemdrive%\*.tmp
              del /f /s /q %systemdrive%\*.tmp
              del /f /s /q %systemdrive%\*.tmp
              del /f /s /q %systemdrive%\*.tmp
              del /f /s /q %systemdrive%\*.tmp
            </p>
            <button type="button" class="btn btn-primary btn-sm d-flex align-items-center">
              <img src="/assets/choice_remove.png" width="15" height="15" class="mr-1" />清空</button>
          </div>
        </div>
        <div class="bing-container d-flex flex-column " style="flex: 1;">
          <h5 class="normal mb-3">发送指令</h5>
          <form class="instructions-form">
            <div style="background-color: #151934; flex: 1;" class="p-3">
              <div class="instructions-container">
              </div>
              <textarea class="form-control mb-2 text-white bg-dark" id="instructionsControlTextarea" rows="3"></textarea>
              <button type="submit" class="btn btn-primary btn-sm">发送指令</button>
            </div>
          </form>
        </div>
      </div>
    </div>`)
      $content.find('.instructions-container').append($instructionslists)
      let point = new BMap.Point(lng, lat);
      let infoWindow = new BMap.InfoWindow($content.html(), opts);  // 创建信息窗口对象 
      // 注册事件
      BMapLib.EventWrapper.addListener(infoWindow, 'open', function (e) {
        Event.trigger('connectWebsocket')
        //绑定信息框的单击事件
        $(".instructions-container").off('click').on("click", 'label', function (e) {
          $('#instructionsControlTextarea').text($(e.currentTarget).find('input').val())
        })
        $(".instructions-form").off('click').submit("click", function (e) {
          e.preventDefault()
          let value = $(e.currentTarget).find('#instructionsControlTextarea').text()
          if (!value) return alert('请选择发送指令')
        })
      })

      map.openInfoWindow(infoWindow, point); //单击marker显示InfoWindow
    })
  }
  // 获取指定时间戳内的设备操作指令
  function AdminGetInstructions({ adminId, fixingId, time }) {
    return axios.post('/AdminGetInstructions', Qs.stringify({ adminId, fixingId, time })).then(res => {
      if (!res) return
      return res.data
    })
  }
  // 获取设备列表（搜索）
  function GetFixingListForSearch({ adminId, query }) {
    return axios.post('/GetFixingListForSearch', Qs.stringify({ adminId, query })).then(res => {
      if (!res) return
      return res.data
    })
  }
  function _SetLoaclStorageUserInfo(userInfo) {
    window.localStorage.setItem('userinfo', JSON.stringify(userInfo))
  }
  function GetCurrentData() {
    return currentData
  }
  // 获取本地存储用户信息
  function GetLoaclStorageUserInfo() {
    return new Promise((resolve, reject) => {
      userInfo = JSON.parse(window.localStorage.getItem('userinfo'))
      if (userInfo) {
        Event.trigger('setUserInfo', $USER_CONTAINER)
        resolve(userInfo)
      } else {
        reject(userInfo)
      }
    })

  }
  function ClearLoaclStorageUserInfo() {
    window.localStorage.removeItem('userinfo')
  }
  function _GetNavTabActiveIndex() {
    return navTabActiveIndex
  }
  function _SetNavTabActiveIndex(index) {
    navTabActiveIndex = index
  }
  function _GetLoaclUserInfo() {
    return userInfo
  }
  function _SetLoaclUserInfo(newUserInfo) {
    userInfo = newUserInfo
  }
  function _SetCurrentArrays(newCurrentArrays) {
    currentArrays = newCurrentArrays
  }
  function _GetCurrentArrays() {
    return currentArrays
  }
  function _GetAllArrays() {
    return allArrays
  }
  function _GetOnlineArrays() {
    return onlineArrays
  }
  function _GetofflineArrays() {
    return offlineArrays
  }
  function _GetIntervalerGetLastPosition() {
    return intervalerGetLastPosition
  }
  function _SetIntervalerGetLastPosition(newIntervalerGetLastPosition) {
    intervalerGetLastPosition = newIntervalerGetLastPosition
  }
  return {
    AdminLoginAccount,
    AdminEditPassword,
    AdminUpdateUserStatusInfo,
    StatisticsUserData,
    AdminStatisticsFixingData,
    GetFixingList,
    GetFixingInfo,
    GetFixingQRCode,
    GetUserCount,
    GetUserList,
    GetUserInfo,
    GetFixingSportData,
    GetLastPosition,
    GetTrackList,
    AdminGetInstructionsList,
    AdminGetInstructions,
    GetFixingListForSearch,
    GetCurrentData,
    GetLoaclStorageUserInfo,
    ClearLoaclStorageUserInfo,
    _GetNavTabActiveIndex,
    _SetNavTabActiveIndex,
    _GetLoaclUserInfo,
    _SetLoaclUserInfo,
    _SetCurrentArrays,
    _GetCurrentArrays,
    _GetAllArrays,
    _GetOnlineArrays,
    _GetofflineArrays,
    _GetIntervalerGetLastPosition,
    _SetIntervalerGetLastPosition,
  }
})(map)


a.GetLoaclStorageUserInfo().then(res => {
  let { fixingId, lng, lat } = Qs.parse(location.search.substr(1)),
    pageName = location.pathname.substr(1),
    times = Math.round(new Date() / 1000)
  switch (pageName) {
    case 'index.html':
      Event.trigger('GetFixingList', res.AdminId, '中国')
      break;
    case 'control.html':
      if (res && fixingId || lng || lat) {
        Event.trigger('GetFixingLiveInfo', res.AdminId, '中国', fixingId)
      } else {
        Event.trigger('GetFixingList', res.AdminId)
      }
      break;
    case 'trajectory.html':
      if (res && fixingId || lng || lat) {
        Event.trigger('GetFixingTrackList', res.AdminId, '中国', fixingId)
      } else {
        Event.trigger('GetFixingList', res.AdminId)
      }
    case 'sportdata.html':
      Event.trigger('GetFixingSportData', res.AdminId, '中国', fixingId, times)
      break;
    default:
      Event.trigger('GetFixingList', res.AdminId, '中国')
      break;
  }

}).catch(error => console.warn(error))