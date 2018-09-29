// 地图遮罩物模块
var mapMarkerPoint = (function () {
  Event.create('map').listen('GetFixingList', function (map, source) {
    mapMarkerPoint.refresh(map, source)
  })

  return {
    refresh(map, source) {
      map.clearOverlays()
      let bs = map.getBounds(),   //获取可视区域
        bssw = bs.getSouthWest(),   //可视区域左下角
        bsne = bs.getNorthEast(),   //可视区域右上角
        b = new BMap.Bounds(new BMap.Point(bssw.lng, bssw.lat), new BMap.Point(bsne.lng, bsne.lat)),
        icon,
        iconPath,
        point,
        marker

      source.forEach(item => {
        let { entity_name, entity_desc, latest_location } = item,
          { longitude, latitude } = latest_location
        if (!b.containsPoint(new BMap.Point(longitude, latitude))) {
          return
        }
        if (entity_desc === '在线') iconPath = '/assets/porint_online.png'
        if (entity_desc === '离线') iconPath = '/assets/porint_offline.png'

        icon = new BMap.Icon(iconPath, new BMap.Size(31, 44))
        point = new BMap.Point(longitude, latitude)
        marker = new BMap.Marker(point, { icon })
        map.addOverlay(marker)          // 将标注添加到地图中
        Event.create('map').trigger('mapInfoWindow', map, source, { marker, point, fixingId: entity_name })
      })
      // Event.create('fixing').trigger('fixingSearch', source, { marker, point })
      // Event.create('fixing').trigger('fixingListsTab', source, { marker, point })
      // Event.create('fixing').trigger('fixingListsPagination', source, 10, { marker, point })
    }
  }
})()

// 地图窗口模块 
var mapInfoWindow = (function () {
  Event.create('map').listen('mapInfoWindow', function (map, source, fixing) {
    mapInfoWindow.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, { marker, point, fixingId }) {
      let opts = { width: 458 },
        infoWindow = new BMap.InfoWindow(`加载中..`, opts) // 创建信息窗口对象 
      BMapLib.EventWrapper.addListener(marker, 'click', function (e) {
        map.openInfoWindow(infoWindow, point); //单击marker显示InfoWindow
      })
      BMapLib.EventWrapper.addListener(infoWindow, 'open', function (e) {
        BMapLib.EventWrapper.clearListeners(map, 'moveend')
        BMapLib.EventWrapper.clearListeners(map, 'zoomend')
        console.log('open')
        let { AdminId } = utils.GetLoaclStorageUserInfo('userinfo')
        FIXING_API.GetLastPosition({ adminId: AdminId, fixingId }).then(res => {
          let positions = res.data.positions.split(','),
            shutdown = res.data.shutdown === '0' ? '关机' : '开机',
            lng = utils.handleToCut(positions[0]),
            lat = utils.handleToCut(positions[1])
          createTime = utils.handleTimestampToDateTime(res.data.createTime),
            charge = res.data.shutdown === '1' ? '充电中' : '未充电',
            modestatus = res.data.modestatus === '1' ? '正常模式' : '追踪模式',
            status = res.data.status === '1' ? '运动' : '静止'
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
          `)
        })
        //绑定信息框的单击事件
        $("#markerinfo").on("click", 'button', function (e) {
          let classNames = ['control-center', 'thetrajectory', 'fixing-info', 'instruction', 'fixing-qrcode'],
            $currentTarget = $(e.currentTarget),
            result = classNames.filter(className => $currentTarget.hasClass(className)),
            { entity_name, latest_location } = item
          switch (result[0]) {
            case 'control-center':
              // Event.trigger('redirectControl', entity_name, point)
              break;
            case 'thetrajectory':
              // Event.trigger('redirectTrajectory', entity_name, point)
              break;
            case 'fixing-info':
              // a.GetFixingInfo({ adminId: userInfo.AdminId, fixingId: entity_name }, point)
              break;
            case 'instruction':
              // a.AdminGetInstructionsList({ adminId: userInfo.AdminId }, point)
              break;
            case 'fixing-qrcode':
              // a.GetFixingQRCode({ adminId: userInfo.AdminId, fixingId: entity_name }, point)
              break;
          }
        });
      })
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
        Event.create('map').trigger('GetFixingList', map, source, fixing)
        Event.create('fixing').trigger('GetFixingList', map, source, fixing)
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

