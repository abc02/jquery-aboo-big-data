

// 地图遮罩物模块
var mapMarkerPoint = (function () {
  Event.create('map').listen('GetFixingList', function (map, source) {
    mapMarkerPoint.refresh(map, source)
  })
  Event.create('map').listen('GetFixingListOnce', function (map, source, fixing) {
    mapMarkerPoint.refreshOnce(map, source, fixing)
  })
  Event.create('map').listen('GetTrackList', function (map, source, fixing) {
    mapMarkerPoint.refreshTrackList(map, source, fixing)
  })


  return {
    refreshTrackList(map, source, fixing) {
      if (!source) return
      let icon,
        iconPath,
        point,
        marker,
        infoWindow
      source.forEach(item => {
        let { shutdown, longitude, latitude  } = item

        if (shutdown === '0') iconPath = '/assets/porint_offline.png'
        if (shutdown === '1') iconPath = '/assets/porint_online.png'

        icon = new BMap.Icon(iconPath, new BMap.Size(31, 44))
        point = new BMap.Point(longitude, latitude)
        marker = new BMap.Marker(point, { icon, offset: new BMap.Size(2, -15) })
        map.addOverlay(marker)
        // switch (fixing.type) {
        //   case 'init':
        //     Event.create('map').trigger('mapInitInfoWindow', map, source, { marker, point, ...item, ...fixing })
        //     break;
        //   case 'update':
        //     infoWindow = map.getInfoWindow()
        //     Event.create('map').trigger('mapUpdateInfoWindow', map, source, { infoWindow, marker, point, ...item, ...fixing })
        //     break
        // }
      })
    },
    refreshOnce(map, source, fixing) {
      map.clearOverlays()
      let icon,
        iconPath,
        point,
        marker,
        infoWindow
      source.forEach(item => {
        let { entity_name, entity_desc, latest_location } = item,
          { longitude, latitude } = latest_location

        if (entity_desc === '在线') iconPath = '/assets/porint_online.png'
        if (entity_desc === '离线') iconPath = '/assets/porint_offline.png'

        icon = new BMap.Icon(iconPath, new BMap.Size(31, 44))
        point = new BMap.Point(longitude, latitude)
        marker = new BMap.Marker(point, { icon })
        map.addOverlay(marker)
        switch (fixing.type) {
          case 'init':
            Event.create('map').trigger('mapInitInfoWindow', map, source, { marker, point, ...item, ...fixing })
            break;
          case 'update':
            infoWindow = map.getInfoWindow()
            Event.create('map').trigger('mapUpdateInfoWindow', map, source, { infoWindow, marker, point, ...item, ...fixing })
            break
        }
      })
    },
    refresh(map, source) {
      map.clearOverlays()
      let cache = null,
        allArrays = Object.assign([], source),
        onlineArrays = utils.FilterFixingLists(source, 'entity_desc', '在线'),
        offlineArrays = utils.FilterFixingLists(source, 'entity_desc', '离线'),
        params = utils.GetUrlParams(),
        bs = map.getBounds(),   //获取可视区域
        bssw = bs.getSouthWest(),   //可视区域左下角
        bsne = bs.getNorthEast(),   //可视区域右上角
        b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bsne.lng, bsne.lat)),
        icon,
        iconPath,
        point,
        marker
      console.log(Number.parseInt(params.fixingListsTabIndex))
      // 根据 tabIndex 选择分组
      switch (Number.parseInt(params.fixingListsTabIndex)) {
        case 0:
          cache = allArrays
          break;
        case 1:
          cache = onlineArrays
          break;
        case 2:
          cache = offlineArrays
          break;
        default:
          cache = allArrays
          break;
      }
      cache.forEach(item => {
        let { entity_name, entity_desc, latest_location } = item,
          { longitude, latitude } = latest_location
        // 判断当前是否在当前视野范围内
        if (!b.containsPoint(new BMap.Point(longitude, latitude))) {
          return
        }
        if (entity_desc === '在线') iconPath = '/assets/porint_online.png'
        if (entity_desc === '离线') iconPath = '/assets/porint_offline.png'

        icon = new BMap.Icon(iconPath, new BMap.Size(31, 44))
        point = new BMap.Point(longitude, latitude)
        marker = new BMap.Marker(point, { icon })
        map.addOverlay(marker)          // 将标注添加到地图中
        // Event.create('fixing').trigger('GetFixingList', map, source, { currentPage, pageSize, marker })
        Event.create('map').trigger('mapInitInfoWindow', map, source, { marker, point, ...item, fixingId: entity_name })
      })
    }
  }
})()

// 地图窗口模块 
var mapInfoWindow = (function () {
  Event.create('map').listen('mapInitInfoWindow', function (map, source, fixing) {
    mapInfoWindow.init(map, source, fixing)
  })
  Event.create('map').listen('mapUpdateInfoWindow', function (map, source, fixing) {
    mapInfoWindow.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, fixing) {
      if (!fixing.infoWindow) return
      console.log(fixing.infoWindow)
      /*  监听窗口 open 事件
          移除地图 移动 放大 事件跟 open 地图窗口有冲突 bug 无限关闪
      */
      BMapLib.EventWrapper.addListener(infoWindow, 'open', function (e) {
        // 通知移除事件
        BMapLib.EventWrapper.clearListeners(map, 'moveend')
        BMapLib.EventWrapper.clearListeners(map, 'zoomend')
        // 请求最后位置信息接口
        let positions = res.data.positions.split(','),
          shutdown = res.data.shutdown === '0' ? '关机' : '开机',
          lng = utils.handleToCut(positions[0]),
          lat = utils.handleToCut(positions[1]),
          createTime = utils.handleTimestampToDateTime(res.data.createTime),
          charge = res.data.charge === '1' ? '充电中' : '未充电',
          modestatus = res.data.modestatus === '1' ? '正常模式' : '追踪模式',
          status = res.data.status === '1' ? '运动' : '静止'
        console.log(charge)
        // 更新窗口对象HTML信息
        infoWindow.setWidth(458)
        infoWindow.setContent(`
            <div class='bg-dark' id='markerinfo'>
            <h5 class='d-flex justify-content-between text-white mb-2'><p>鞋垫ID：<span class="fixingid">${fixing.fixingId}</span></p>
            </h5>
            <div class='d-flex flex-row color-drak mb-2'>
              <p style='flex: 1;'><span class='mr-2'>描述 </span><span class='text-white shutdown'>${shutdown}<span></p>
              <p style='flex: 1;'><span class='mr-2'>定位类型 </span><span class='color-white mode'>${res.data.mode}</span></p>
            </div>
            <div class='d-flex flex-row color-drak mb-2'>
              <p style='flex: 1;'><span class='mr-2'>充电状态 </span><span class='text-white charge'>${charge}<span></p>
              <p style='flex: 1;'><span class='mr-2'>当前模式 </span><span class='color-white modestatus'>${modestatus}</span></p>
            </div>
            <div class='d-flex flex-row color-drak mb-2'>
            <p style='flex: 1;'><span class='mr-2'>精度 </span><span class='text-white radius'>${res.data.radius}<span></p>
            <p style='flex: 1;'><span class='mr-2'>状态 </span><span class='color-white status'>${status}</span></p>
          </div>
            <div class='d-flex flex-row color-drak mb-2'>
              <p style='flex: 1;'><span class='mr-2'>经纬度 </span><span class='text-white positions'>${lng}, ${lat}</span></p>
              <p style='flex: 1;'><span class='mr-2'>定位时间 </span><span class='text-white createTime'>${createTime}</span></p>
            </div>
            <div class='d-flex flex-row color-drak mb-4'>
              <p style='flex: 1;'><spann class='mr-2'>位置 </span><span class='text-white address'>${res.data.address}</span></p>
            </div>
            <div class='d-flex justify-content-center info-window-buttons'>
              <button type='button' class='control ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='16' height='17' src='/assets/contro_Thetrajectory.png' />控制中心</button>
              <button type='button' class='trajectory ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='16' height='17' src='/assets/contro_Thetrajectory.png' />轨迹</button>
              <button type='button' class='fixing-info  ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='14' height='17' src='/assets/contro_data.png' />资料</button>
              <button type='button' class='instruction ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='12' height='18' src='/assets/contro_instruction.png' />指令</button>
              <button type='button' class='fixing-qrcode ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='16' height='16' src='/assets/contro_Qrcode.png' />二维码</button>
            </div>
          </div>
          `)
        return res
      }).then(res => {
        $("#markerinfo").on("click", 'button', function (e) {
          let classNames = ['control', 'trajectory', 'fixing-info', 'instruction', 'fixing-qrcode'],
            $currentTarget = $(e.currentTarget),
            result = classNames.filter(className => $currentTarget.hasClass(className)),
            params = utils.GetUrlParams()
          switch (result[0]) {
            case 'control':
              params.pageSize = 6
              location.assign(`${result[0]}.html?${Qs.stringify(params)}`)
              break;
            case 'trajectory':
              params.pageSize = 6
              location.assign(`${result[0]}.html?${Qs.stringify(params)}`)
              break;
            case 'fixing-info':
              Event.create('fixing').trigger('GetFixingInfo', map, source, { infoWindow, fixingId })
              break;
            case 'instruction':
              Event.create('fixing').trigger('AdminGetInstructionsList', map, source, { infoWindow, fixingId })
              break;
            case 'fixing-qrcode':
              Event.create('fixing').trigger('GetFixingQRCode', map, source, { infoWindow, fixingId })
              break;
          }
        })
      })

      // 重新监听地图移动、放大事件
      BMapLib.EventWrapper.addListener(infoWindow, 'close', function () {
        Event.create('map').trigger('mapMoveendEvent', map, source)
        Event.create('map').trigger('mapZoomendEvent', map, source)
      })


    },
    init(map, source, { marker, point, fixingId }) {
      // 默认创建窗口对象
      let opts = { width: 458 },
        infoWindow = new BMap.InfoWindow(`加载中..`, opts)
      // 监听覆盖物 click 事件
      BMapLib.EventWrapper.addListener(marker, 'click', function (e) {
        map.openInfoWindow(infoWindow, point)
      })
      /*  监听窗口 open 事件
          移除地图 移动 放大 事件跟 open 地图窗口有冲突 bug 无限关闪
      */
      BMapLib.EventWrapper.addListener(infoWindow, 'open', function (e) {
        // 通知移除事件
        BMapLib.EventWrapper.clearListeners(map, 'moveend')
        BMapLib.EventWrapper.clearListeners(map, 'zoomend')
        // loacl 获取数据
        let { AdminId } = utils.GetLoaclStorageUserInfo('userinfo')
        // 请求最后位置信息接口
        FIXING_API.GetLastPosition({ adminId: AdminId, fixingId }).then(res => {
          let positions = res.data.positions.split(','),
            shutdown = res.data.shutdown === '0' ? '关机' : '开机',
            lng = utils.handleToCut(positions[0]),
            lat = utils.handleToCut(positions[1]),
            createTime = utils.handleTimestampToDateTime(res.data.createTime),
            charge = res.data.charge === '1' ? '充电中' : '未充电',
            modestatus = res.data.modestatus === '1' ? '正常模式' : '追踪模式',
            status = res.data.status === '1' ? '运动' : '静止'

          // 更新窗口对象HTML信息
          infoWindow.setWidth(458)
          infoWindow.setContent(`
            <div class='bg-dark' id='markerinfo'>
            <h5 class='d-flex justify-content-between text-white mb-2'><p>鞋垫ID：<span class="fixingid">${fixingId}</span></p>
            </h5>
            <div class='d-flex flex-row color-drak mb-2'>
              <p style='flex: 1;'><span class='mr-2'>描述 </span><span class='text-white shutdown'>${shutdown}<span></p>
              <p style='flex: 1;'><span class='mr-2'>定位类型 </span><span class='color-white mode'>${res.data.mode}</span></p>
            </div>
            <div class='d-flex flex-row color-drak mb-2'>
              <p style='flex: 1;'><span class='mr-2'>充电状态 </span><span class='text-white charge'>${charge}<span></p>
              <p style='flex: 1;'><span class='mr-2'>当前模式 </span><span class='color-white modestatus'>${modestatus}</span></p>
            </div>
            <div class='d-flex flex-row color-drak mb-2'>
            <p style='flex: 1;'><span class='mr-2'>精度 </span><span class='text-white radius'>${res.data.radius}<span></p>
            <p style='flex: 1;'><span class='mr-2'>状态 </span><span class='color-white status'>${status}</span></p>
          </div>
            <div class='d-flex flex-row color-drak mb-2'>
              <p style='flex: 1;'><span class='mr-2'>经纬度 </span><span class='text-white positions'>${lng}, ${lat}</span></p>
              <p style='flex: 1;'><span class='mr-2'>定位时间 </span><span class='text-white createTime'>${createTime}</span></p>
            </div>
            <div class='d-flex flex-row color-drak mb-4'>
              <p style='flex: 1;'><spann class='mr-2'>位置 </span><span class='text-white address'>${res.data.address}</span></p>
            </div>
            <div class='d-flex justify-content-center info-window-buttons'>
              <button type='button' class='control ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='16' height='17' src='/assets/contro_Thetrajectory.png' />控制中心</button>
              <button type='button' class='trajectory ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='16' height='17' src='/assets/contro_Thetrajectory.png' />轨迹</button>
              <button type='button' class='fixing-info  ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='14' height='17' src='/assets/contro_data.png' />资料</button>
              <button type='button' class='instruction ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='12' height='18' src='/assets/contro_instruction.png' />指令</button>
              <button type='button' class='fixing-qrcode ml-2 mr-2 pl-1 pr-1 bg-primary button rounded d-flex justify-content-center align-items-center text-white'><img
                  width='16' height='16' src='/assets/contro_Qrcode.png' />二维码</button>
            </div>
          </div>
          `)
          return res
        }).then(res => {
          $("#markerinfo").on("click", 'button', function (e) {
            let classNames = ['control', 'trajectory', 'fixing-info', 'instruction', 'fixing-qrcode'],
              $currentTarget = $(e.currentTarget),
              result = classNames.filter(className => $currentTarget.hasClass(className)),
              params = utils.GetUrlParams()
            switch (result[0]) {
              case 'control':
                params.pageSize = 6
                location.assign(`${result[0]}.html?${Qs.stringify(params)}`)
                break;
              case 'trajectory':
                params.pageSize = 6
                location.assign(`${result[0]}.html?${Qs.stringify(params)}`)
                break;
              case 'fixing-info':
                Event.create('fixing').trigger('GetFixingInfo', map, source, { infoWindow, fixingId })
                break;
              case 'instruction':
                Event.create('fixing').trigger('AdminGetInstructionsList', map, source, { infoWindow, fixingId })
                break;
              case 'fixing-qrcode':
                Event.create('fixing').trigger('GetFixingQRCode', map, source, { infoWindow, fixingId })
                break;
            }
          })
        })
      })

      // 重新监听地图移动、放大事件
      BMapLib.EventWrapper.addListener(infoWindow, 'close', function () {
        Event.create('map').trigger('mapMoveendEvent', map, source)
        Event.create('map').trigger('mapZoomendEvent', map, source)
      })


    }
  }
})()

// 地图移动事件模块
var mapMoveendEvent = (function () {
  Event.create('map').listen('GetFixingList', function (map, source, fixing) {
    mapMoveendEvent.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, fixing) {
      BMapLib.EventWrapper.clearListeners(map, 'moveend')
      BMapLib.EventWrapper.addListener(map, 'moveend', function () {
        let params = utils.GetUrlParams()
        Event.create('map').trigger('GetFixingList', map, source, params)
        Event.create('fixing').trigger('GetFixingList', map, source, params)
      })
    }
  }
})()

// 地图放大事件模块
var mapZoomendEvent = (function () {
  Event.create('map').listen('GetFixingList', function (map, source, fixing) {
    mapZoomendEvent.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, fixing) {
      BMapLib.EventWrapper.clearListeners(map, 'zoomend')
      BMapLib.EventWrapper.addListener(map, 'zoomend', function () {
        Event.create('map').trigger('GetFixingList', map, source, fixing)
        Event.create('fixing').trigger('GetFixingList', map, source, fixing)
      })
    }
  }
})()

var mapPanToMarkerPoint = (function () {
  Event.create('map').listen('mapPanToMarkerPoint', function (map, point) {
    mapPanToMarkerPoint.refresh(map, point)
  })

  return {
    refresh(map, { lng, lat }) {
      map.panTo(new BMap.Point(lng, lat))
    }
  }
})()

// 地图轨迹模式
var mapTrajectory = (function () {
  Event.create('map').listen('GetTrackList', function (map, source, fixing) {
    mapTrajectory.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, fixing) {
      if(!source) return
      let startItem = source[0],
        endItem = source[source.length - 1],
        startIcon = new BMap.Icon("/assets/trajectory_start.png", new BMap.Size(31, 44)),
        endIcon = new BMap.Icon("/assets/trajectory_end.png", new BMap.Size(31, 44)),
        startPoint = new BMap.Point(startItem.longitude, startItem.latitude),
        endPoint = new BMap.Point(endItem.longitude, endItem.latitude),
        startMarker = new BMap.Marker(startPoint, { icon: startIcon }),
        endMarker = new BMap.Marker(endPoint, { icon: endIcon }),
        polylines = source.map(item => new BMap.Point(item.longitude, item.latitude)),
        polyline = new BMap.Polyline(polylines, { strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.5 });   //创建折线

      map.addOverlay(startMarker)
      map.addOverlay(endMarker)
      map.addOverlay(polyline);   //增加折线
      map.setViewport(polylines)
    }
  }
})()



// 鞋垫地图计数模块
var mapMarkerCount = (function ($el) {
  Event.create('map').listen('GetFixingList', function (map) {
    mapMarkerCount.refresh(map)
  })
  Event.create('map').listen('GetFixingListOnce', function (map) {
    mapMarkerCount.refresh(map)
  })
  Event.create('map').listen('GetLastPosition', function (map) {
    mapMarkerCount.refresh(map)
  })
  Event.create('map').listen('GetTrackList', function (map) {
    mapMarkerCount.refresh(map)
  })
  return {
    refresh(map) {
      $el.text(map.getOverlays().length)
    }
  }
})($('.visible-marker'))

