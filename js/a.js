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
    $FIXING_MARKER_COUNT.text(map.getOverlays().length)
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
    }, 60000))
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

// let a = (function (map) {
//     let persons = []  // 存储获取到的数据
//   function handlerFile(e) {
//     let files = e.target.files,
//       fileName = files[0].name,
//       fileSize = `大小：${(files[0].size / 1024).toFixed(0)}kb`
//     fileReader = new FileReader()
//     fileReader.onload = function (ev) {
//       try {
//         var data = ev.target.result,
//           workbook = XLSX.read(data, {
//             type: 'binary'
//           }) // 以二进制流方式读取得到整份excel表格对象
//         // persons = []; // 存储获取到的数据
//       } catch (e) {
//         console.log('文件类型不正确');
//         return;
//       }

//       // 表格的表格范围，可用于判断表头是否数量是否正确
//       var fromTo = '';
//       console.log(workbook)
//       // 遍历每张表读取
//       for (var sheet in workbook.Sheets) {
//         if (workbook.Sheets.hasOwnProperty(sheet)) {
//           fromTo = workbook.Sheets[sheet]['!ref'];
//           console.log(fromTo);
//           for (var page in workbook.Sheets[sheet])
//             switch (page) {
//               case '!margins':
//                 break;
//               case '!ref':
//                 break;
//               default:
//                 persons.push(workbook.Sheets[sheet][page].v)
//                 break;
//             }
//           // persons = persons.concat(XLSX.utils.sheet_to_csv(workbook.Sheets[sheet], ','));
//           break; // 如果只取第一张表，就取消注释这行
//         }
//       }
//       $('.file-name').text(fileName)
//       $('.file-size').text(fileSize)
//       $('.file-result').show()
//       console.log(persons);
//     };
//     // 以二进制方式打开文件
//     fileReader.readAsBinaryString(files[0]);
//   }
//   $('#excel-file').on('change', handlerFile);
//   $('#restart-file').on('change', handlerFile);
//   $('#update-file').on('click', function () {
//     let userinfo = a._GetLoaclUserInfo()
//     a.BatchAddFixing({ adminId: userinfo.AdminId, batchId: '', fixingIds: persons.join(',') }).then(res => {
//       alert(res.code)
//     })
//   })
//   $DATEPICKER.on('input', function (e) {
//     let userinfo = a._GetLoaclUserInfo(),
//       time = $(e.currentTarget).val(),
//       { fixingId } = Qs.parse(location.search.substr(1))
//     if (!time) {
//       alert('选择日期不能为空')
//       time = timestamp(Date.now(), true)
//       $DATEPICKER.val(time)
//       return
//     }
//     a.GetTrackList({ adminId: userinfo.AdminId, fixingId, time }).then(res => {
//       if (!res) return res
//       map.clearOverlays()
//       // map.panTo(new BMap.Point(res.data[0].longitude, res.data[0].latitude));
//       Event.trigger('setTrackListMarkerStartPoint', res.data[0])
//       Event.trigger('setTrackListMarkerEndPoint', res.data[res.data.length - 1])
//       // res.data.map(item => Event.trigger('setTrackListMarkerPoint', item))
//       Event.trigger('setTrackListPolyline', res.data)
//       Event.trigger('setTrackList', $TRACK_LIST_TBODT, res.data, fixingId)
//     })
//   })

// })(map)