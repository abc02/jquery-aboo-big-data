Event.listen('GetTrackList', fixinginfo => {
    a.GetTrackList({ adminId: userinfo.AdminId, fixingId: fixinginfo.entity_name, time }).then(res => {
      map.clearOverlays()
      // map.panTo(new BMap.Point(res.data[0].longitude, res.data[0].latitude));
      Event.trigger('setTrackListMarkerStartPoint', res.data[0])
      Event.trigger('setTrackListMarkerEndPoint', res.data[res.data.length - 1])
      // res.data.map(item => Event.trigger('setTrackListMarkerPoint', item))
      Event.trigger('setTrackListPolyline', res.data)
      Event.trigger('setTrackList', $TRACK_LIST_TBODT, res.data, fixinginfo.entity_name)
    })
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