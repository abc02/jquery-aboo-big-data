var mapPolyline = (function () {
  Event.create('map').listen('polyline', (map, source, params, fixing) => {
    mapPolyline.refresh(map, source, params, fixing)
  })

  return {
    refresh(map, source, params, fixing) {
      let polylines = []
      source.forEach(item => {
        if (fixing.modegps && item.mode === 'GPS') {
          polylines.push(new BMap.Point(item.longitude, item.latitude))
        }
        if (fixing.modelbs && item.mode === 'LBS') {
          polylines.push(new BMap.Point(item.longitude, item.latitude))
        }
        if (fixing.modewifi && item.mode === 'WIFI') {
          polylines.push(new BMap.Point(item.longitude, item.latitude))
        }
      })
      let polyline = new BMap.Polyline(polylines, { strokeColor: "#689bff", strokeWeight: 4, strokeOpacity: 0.8 });   //创建折线
      map.addOverlay(polyline);   //增加折线
      map.setViewport(polylines)
    }
  }
})()

// 地图遮罩物
var mapMarkerPoint = (function () {
  Event.create('map').listen('index', (map, source, params) => {
    console.log('addMarkerPoint')
    mapMarkerPoint.addMarkerPoint(map, source, params)
  })
  Event.create('map').listen('control', (map, item, params) => {
    mapMarkerPoint.addControlMarkerPoint(map, item, params)
  })

  Event.create('map').listen('trajectory', (map, source, params, fixing) => {
    mapMarkerPoint.addTrajectoryMarkerPoint(map, source, params, fixing)
  })

  return {
    addMarkerPoint(map, source, params) {
      map.clearOverlays()
      if (!source) return
      let caches = null, iconPath, marker,
        bs = map.getBounds(),   //获取可视区域
        bssw = bs.getSouthWest(),   //可视区域左下角
        bsne = bs.getNorthEast(),   //可视区域右上角
        b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bsne.lng, bsne.lat))
      if (params.fixingListsTabIndex === 0) caches = Object.assign([], source)
      if (params.fixingListsTabIndex === 1) caches = utils.FilterFixingLists(source, 'entity_desc', '在线')
      if (params.fixingListsTabIndex === 2) caches = utils.FilterFixingLists(source, 'entity_desc', '离线')
      if (!caches) return
      caches.forEach(item => {
        let { longitude, latitude } = item.latest_location,
          point = new BMap.Point(longitude, latitude)
        // 判断当前是否在当前视野范围内
        if (!b.containsPoint(new BMap.Point(longitude, latitude))) {
          return
        }
        if (item.entity_desc === '在线') iconPath = '/assets/porint_online.png'
        if (item.entity_desc === '离线') iconPath = '/assets/porint_offline.png'
        marker = new BMap.Marker(point, { icon: new BMap.Icon(iconPath, new BMap.Size(31, 44)) })
        map.addOverlay(marker)          // 将标注添加到地图中
        Event.create('map').trigger('initMarkerInfoWindow', map, source, params, { fixingId: item.entity_name, point }, marker)
      })
    },
    addControlMarkerPoint(map, item, params) {
      map.clearOverlays()
      if (!item) return

      let { longitude, latitude } = item.latest_location, iconPath, marker,
        point = new BMap.Point(longitude, latitude)
      if (item.entity_desc === '在线') iconPath = '/assets/porint_online.png'
      if (item.entity_desc === '离线') iconPath = '/assets/porint_offline.png'
      marker = new BMap.Marker(point, { icon: new BMap.Icon(iconPath, new BMap.Size(31, 44)) })
      map.addOverlay(marker)
    },
    addTrajectoryMarkerPoint(map, source, params, fixing) {
      if (!source) return
      let markers = [], marker

      source.forEach(item => {
        if (fixing.modegps && item.mode === 'GPS') {
          markers.push(item)
        }
        if (fixing.modelbs && item.mode === 'LBS') {
          markers.push(item)
        }
        if (fixing.modewifi && item.mode === 'WIFI') {
          markers.push(item)
        }
      })
      markers.forEach((item, index) => {
        item.markerIndex = index
        if (index === 0) {
          marker = new BMap.Marker(new BMap.Point(item.longitude, item.latitude), { icon: new BMap.Icon('/assets/trajectory_start.png', new BMap.Size(31, 44)) })
        }
        if (index === markers.length - 1) {
          marker = new BMap.Marker(new BMap.Point(item.longitude, item.latitude), { icon: new BMap.Icon('/assets/trajectory_end.png', new BMap.Size(31, 44)) })
        }
        if (index !== 0 && index !== markers.length - 1) {
          marker = new BMap.Marker(new BMap.Point(item.longitude, item.latitude), { icon: new BMap.Icon('/assets/address-new.png', new BMap.Size(20, 20), { imageSize: new BMap.Size(20, 20) }) })
        }
        map.addOverlay(marker)
        Event.create('map').trigger('trajectoryMarkerInfoWindow', map, item, params, fixing, marker)
      })


    }
  }
})()

// 地图窗口
var mapInfoWindow = (function ($el) {
  Event.create('map').listen('initMarkerInfoWindow', function (map, source, params, fixing, marker) {
    mapInfoWindow.initMarkerInfoWindow(map, source, params, fixing, marker)
  })
  Event.create('map').listen('controlMarkerInfoWindow', function (map, item, params, fixing, marker) {
    mapInfoWindow.controlMarkerInfoWindow(map, item, params, fixing, marker)
  })
  Event.create('map').listen('trajectoryMarkerInfoWindow', function (map, item, params, fixing, marker) {
    console.log('trajectoryMarkerInfoWindow')
    mapInfoWindow.trajectoryMarkerInfoWindow(map, item, params, fixing, marker)
  })

  return {
    initMarkerInfoWindow(map, source, params, fixing, marker) {
      map.closeInfoWindow()
      // 默认创建窗口对象
      let markerInfoWindow = new BMap.InfoWindow(`加载中..`, { width: 458, height: 230, offset: new BMap.Size(0, -20) })
      // 监听覆盖物 click 事件
      BMapLib.EventWrapper.addListener(marker, 'click', function (e) {
        map.openInfoWindow(markerInfoWindow, fixing.point)
      })

      /*  监听窗口 open 事件
          移除地图 移动 放大 事件跟 open 地图窗口有冲突 bug 无限关闪
      */
      BMapLib.EventWrapper.addListener(markerInfoWindow, 'open', function (e) {
        // 通知移除事件
        BMapLib.EventWrapper.clearListeners(map, 'moveend')
        BMapLib.EventWrapper.clearListeners(map, 'zoomend')
        // loacl 获取数据
        let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
        // 请求最后位置信息接口
        FIXING_API.GetLastPosition({ adminId: userInfo.AdminId, fixingId: fixing.fixingId }).then(res => {
          if (res.data.ret === 1001) {
            let address = res.data.address,
              charge = res.data.charge === '1' ? '充电中' : '未充电',
              createTime = utils.handleTimestampToDateTime(res.data.createTime),
              electricity = res.data.electricity, // 电量
              mode = res.data.mode,
              modestatus = res.data.modestatus === '0' ?  '省电模式' : res.data.modestatus === '1' ? '正常模式' : '追踪模式',
              // modestatus = res.data.modestatus === '1' ? '正常模式' : '追踪模式',
              positions = res.data.positions.split(','),
              lng = utils.handleToCut(positions[0], 4),
              lat = utils.handleToCut(positions[1], 4),
              shutdown = res.data.shutdown === '0' ? '关机' : '开机',
              status = res.data.status === '1' ? '运动' : '静止'

            // $el.find('.fixingid').text(fixing.fixingId)
            $el.find('.shutdown').text(shutdown)
            $el.find('.mode').text(mode)
            $el.find('.charge').text(charge)
            $el.find('.modestatus').text(modestatus)
            $el.find('.createTime').text(createTime)
            $el.find('.status').text(status)
            $el.find('.positions').text(`${lng}, ${lat}`)
            $el.find('.electricity').text(`${electricity}%`)
            $el.find('.address').text(address)
            markerInfoWindow.setTitle(`<h5 class="mb-2">${fixing.fixingId}</h5>`)
            markerInfoWindow.setContent($el.html())
            return markerInfoWindow
          }
          if (res.data.ret === 1002) {
            markerInfoWindow.setContent(res.data.code)
          }

          if (res.data.ret === 1003) {
            $el.find('.shutdown').text('初始化')
            $el.find('.mode').text('初始化')
            $el.find('.charge').text('初始化')
            $el.find('.modestatus').text('初始化')
            $el.find('.createTime').text('初始化')
            $el.find('.status').text('初始化')
            $el.find('.positions').text('初始化')
            $el.find('.electricity').text('初始化')
            $el.find('.address').text('初始化')
            markerInfoWindow.setTitle(`<h5 class="mb-2">${fixing.fixingId}</h5>`)
            markerInfoWindow.setContent($el.html())
          }
        })
      })

      // 重新监听地图移动、放大事件
      BMapLib.EventWrapper.addListener(markerInfoWindow, 'close', function () {
        Event.create('map').trigger('index', map, source, params)
      })
      if (fixing.isTrigger) {
        BMapLib.EventWrapper.trigger(marker, 'click')
      }
    },
    controlMarkerInfoWindow(map, item, params, fixing, marker) {
      let markerInfoWindow
      // console.log(item, params, fixing, marker)
      if (fixing.type === 'init') {
        // map.closeInfoWindow()
        // 默认创建窗口对象
        markerInfoWindow = new BMap.InfoWindow(`加载中..`, { width: 458, height: 230, offset: new BMap.Size(0, -20) })
        // 监听覆盖物 click 事件
        BMapLib.EventWrapper.addListener(marker, 'click', function (e) {
          map.openInfoWindow(markerInfoWindow, fixing.point)
        })
        BMapLib.EventWrapper.addListener(markerInfoWindow, 'open', function (e) {
          if (item.ret === 1001) {
            let address = item.address,
              charge = item.charge === '1' ? '充电中' : '未充电',
              createTime = utils.handleTimestampToDateTime(item.createTime),
              electricity = item.electricity, // 电量
              mode = item.mode,
              modestatus = item.modestatus === '0' ?  '省电模式' : item.modestatus === '1' ? '正常模式' : '追踪模式',
              // modestatus = item.modestatus === '1' ? '正常模式' : '追踪模式',
              positions = item.positions.split(','),
              lng = utils.handleToCut(positions[0], 4),
              lat = utils.handleToCut(positions[1], 4),
              shutdown = item.shutdown === '0' ? '关机' : '开机',
              status = item.status === '1' ? '运动' : '静止'

            // $el.find('.fixingid').text(fixing.fixingId)
            $el.find('.shutdown').text(shutdown)
            $el.find('.mode').text(mode)
            $el.find('.charge').text(charge)
            $el.find('.modestatus').text(modestatus)
            $el.find('.createTime').text(createTime)
            $el.find('.status').text(status)
            $el.find('.positions').text(`${lng}, ${lat}`)
            $el.find('.electricity').text(`${electricity}%`)
            $el.find('.address').text(address)
            markerInfoWindow.setTitle(`<h5 class="mb-2">${fixing.fixingId}</h5>`)
            markerInfoWindow.setContent($el.html())
          }

          if (item.ret === 1002) {
            markerInfoWindow.setContent(res.data.code)
          }

          if (item.ret === 1003) {
            $el.find('.shutdown').text('初始化')
            $el.find('.mode').text('初始化')
            $el.find('.charge').text('初始化')
            $el.find('.modestatus').text('初始化')
            $el.find('.createTime').text('初始化')
            $el.find('.status').text('初始化')
            $el.find('.positions').text('初始化')
            $el.find('.electricity').text('初始化')
            $el.find('.address').text('初始化')
            markerInfoWindow.setTitle(`<h5 class="mb-2">${fixing.fixingId}</h5>`)
            markerInfoWindow.setContent($el.html())
          }
        })
        if (fixing.isTrigger) {
          BMapLib.EventWrapper.trigger(marker, 'click')
        }
      }

      if (fixing.type === 'update') {
        log(fixing)
        log(item)
        // map.closeInfoWindow()
        // 默认创建窗口对象
        markerInfoWindow = new BMap.InfoWindow(`加载中..`, { width: 458, height: 230, offset: new BMap.Size(0, -20) })
        // 监听覆盖物 click 事件
        BMapLib.EventWrapper.addListener(marker, 'click', function (e) {
          map.openInfoWindow(markerInfoWindow, fixing.point)
        })
        // markerInfoWindow = map.getInfoWindow()
        BMapLib.EventWrapper.addListener(markerInfoWindow, 'open', function (e) {
          if (item.ret === 1001) {
            let address = item.address,
              charge = item.charge === '1' ? '充电中' : '未充电',
              createTime = utils.handleTimestampToDateTime(item.createTime),
              electricity = item.electricity, // 电量
              mode = item.mode,
              modestatus = item.modestatus === '0' ?  '省电模式' : item.modestatus === '1' ? '正常模式' : '追踪模式',
              // modestatus = item.modestatus === '1' ? '正常模式' : '追踪模式',
              positions = item.positions.split(','),
              lng = utils.handleToCut(positions[0], 4),
              lat = utils.handleToCut(positions[1], 4),
              shutdown = item.shutdown === '0' ? '关机' : '开机',
              status = item.status === '1' ? '运动' : '静止'

            // $el.find('.fixingid').text(fixing.fixingId)
            $el.find('.shutdown').text(shutdown)
            $el.find('.mode').text(mode)
            $el.find('.charge').text(charge)
            $el.find('.modestatus').text(modestatus)
            $el.find('.createTime').text(createTime)
            $el.find('.status').text(status)
            $el.find('.positions').text(`${lng}, ${lat}`)
            $el.find('.electricity').text(`${electricity}%`)
            $el.find('.address').text(address)
            markerInfoWindow.setTitle(`<h5 class="mb-2">${fixing.fixingId}</h5>`)
            markerInfoWindow.setContent($el.html())
          }
          if (item.ret === 1002) {
            markerInfoWindow.setContent(res.data.code)
          }

          if (item.ret === 1003) {
            $el.find('.shutdown').text('初始化')
            $el.find('.mode').text('初始化')
            $el.find('.charge').text('初始化')
            $el.find('.modestatus').text('初始化')
            $el.find('.createTime').text('初始化')
            $el.find('.status').text('初始化')
            $el.find('.positions').text('初始化')
            $el.find('.electricity').text('初始化')
            $el.find('.address').text('初始化')
            markerInfoWindow.setTitle(`<h5 class="mb-2">${fixing.fixingId}</h5>`)
            markerInfoWindow.setContent($el.html())
          }

        })
        if (fixing.isTrigger) {
          BMapLib.EventWrapper.trigger(marker, 'click')
        }
      }

    },
    trajectoryMarkerInfoWindow(map, item, params, fixing, marker) {
      let markerInfoWindow = new BMap.InfoWindow(`加载中..`, { width: 458, height: 230 })

      let address = item.address,
        charge = item.charge === '1' ? '充电中' : '未充电',
        createTime = item.create_time,
        electricity = item.electricity, // 电量
        longitude = utils.handleToCut(item.latitude, 4),
        latitude = utils.handleToCut(item.longitude, 4),
        mode = item.mode,
        modestatus = item.modestatus === '0' ?  '省电模式' : item.modestatus === '1' ? '正常模式' : '追踪模式',
        // modestatus = item.modestatus === '1' ? '正常模式' : '追踪模式',
        shutdown = item.shutdown === '0' ? '关机' : '开机',
        status = item.status === '1' ? '运动' : '静止'

      // $el.find('.fixingid').text(fixing.fixingId)
      $el.find('.shutdown').text(shutdown)
      $el.find('.mode').text(mode)
      $el.find('.charge').text(charge)
      $el.find('.modestatus').text(modestatus)
      $el.find('.createTime').text(createTime)
      $el.find('.status').text(status)
      $el.find('.positions').text(`${longitude}, ${latitude}`)
      $el.find('.electricity').text(`${electricity}%`)
      $el.find('.address').text(address)
      markerInfoWindow.setTitle(`<h5 class="mb-2">${fixing.fixingId}</h5>`)
      markerInfoWindow.setContent($el.html())

      if (marker) {
        marker.addEventListener("click", function (e) {
          map.openInfoWindow(markerInfoWindow, new BMap.Point(item.longitude, item.latitude))
          $('.track-list-tbody > tr')
            .eq(item.markerIndex)
            .addClass('active')
            .siblings()
            .removeClass('active')
          utils.setUrlToTableIndex(item.markerIndex)
        })
      } else {
        map.openInfoWindow(markerInfoWindow, new BMap.Point(item.longitude, item.latitude))
      }

    }

  }
})($('#marker-info-window'))

// 地图事件
var mapEvent = (function () {
  Event.create('map').listen('index', function (map, source, params) {
    mapEvent.unbindMapMoveendEvent(map)
    mapEvent.unbindMapZoomendEvent(map)
    mapEvent.bindMapMoveendEvent(map, source, params)
    mapEvent.bindMapZoomendEvent(map, source, params)
  })

  function hanldeMapEvent(map, source, params) {
    Event.create('map').trigger('index', map, source, params)
  }
  return {
    unbindMapMoveendEvent(map) {
      BMapLib.EventWrapper.clearListeners(map, 'moveend', hanldeMapEvent)
    },
    unbindMapZoomendEvent(map) {
      BMapLib.EventWrapper.clearListeners(map, 'zoomend', hanldeMapEvent)
    },
    // 地图移动事件
    bindMapMoveendEvent(map, source, params) {
      BMapLib.EventWrapper.addListener(map, 'moveend', hanldeMapEvent.bind(null, map, source, params))
    },
    // 地图放大事件
    bindMapZoomendEvent(map, source, params) {
      BMapLib.EventWrapper.addListener(map, 'zoomend', hanldeMapEvent.bind(null, map, source, params))
    }
  }
})()


var mapPanToMarkerPoint = (function () {
  Event.create('map').listen('mapPanToMarkerPoint', function (map, point) {
    mapPanToMarkerPoint.refresh(map, point)
  })

  return {
    refresh(map, point) {
      map.panTo(point)
    }
  }
})()


var fixingTrajectoryFilter = (function ($el) {
  Event.create('map').listen('GetTrackList', function (map, source, params, fixing) {
    fixingTrajectoryFilter.refresh(map, source, params, fixing)
  })

  return {
    refresh(map, source, params, fixing) {
      var $modegps = $el.find("#modegps"),
        $modelbs = $el.find("#modelbs"),
        $modewifi = $el.find("#modewifi")

      $modegps.off('change').on('change', function () {
        fixing.modegps = $(this).prop('checked')
        Event.create('fixing').trigger('fixingTrajectoryTable', map, source, params, fixing)
        Event.create('map').trigger('GetTrackList', map, source, params, fixing)
      })
      $modelbs.off('change').on('change', function () {
        fixing.modelbs = $(this).prop('checked')
        Event.create('fixing').trigger('fixingTrajectoryTable', map, source, params, fixing)
        Event.create('map').trigger('GetTrackList', map, source, params, fixing)
      })
      $modewifi.off('change').on('change', function () {
        fixing.modewifi = $(this).prop('checked')
        Event.create('fixing').trigger('fixingTrajectoryTable', map, source, params, fixing)
        Event.create('map').trigger('GetTrackList', map, source, params, fixing)
      })
    }
  }
})($('.mode-container'))


// 轨迹历史
var mapTrajectory = (function () {
  Event.create('map').listen('GetTrackList', function (map, source, params, fixing) {
    mapTrajectory.refresh(map, source, params, fixing)
  })

  return {
    refresh(map, source, params, fixing) {
      map.clearOverlays()
      Event.create('map').trigger('trajectory', map, source, params, fixing)
      Event.create('map').trigger('polyline', map, source, params, fixing)
    }
  }
})()


// 鞋垫地图计数模块
var mapMarkerCount = (function ($el) {
  Event.create('map').listen('index', function (map) {
    mapMarkerCount.refresh(map)
  })
  return {
    refresh(map) {
      $el.text(map.getOverlays().length)
    }
  }
})($('.visible-marker'))

