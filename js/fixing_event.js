// 搜索
var fixingSearch = (function ($el) {
  Event.create('fixing').listen('index', function (map, source, params) {
    fixingSearch.unBindEvent()
    fixingSearch.bindIndexEvent(map, source, params)
  })
  Event.create('fixing').listen('control', function (map, source, params) {
    fixingSearch.bindEvent(map, source, params)
  })
  Event.create('fixing').listen('trajectory', function (map, source, params) {
    fixingSearch.bindEvent(map, source, params)
  })
  Event.create('fixing').listen('sportdata', function (map, source, params) {
    fixingSearch.bindEvent(map, source, params)
  })
  return {
    unBindEvent() {
      $el.off('click')
    },
    bindIndexEvent(map, source, params) {
      $el.on('click', 'button', function (e) {
        let value = $el.find('.nav-search').val(),
          userInfo = utils.GetLoaclStorageUserInfo('userinfo')
        FIXING_API.GetFixingListForSearch({ adminId: userInfo.AdminId, query: value }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('map').trigger('index', map, res.data.data, params)
            Event.create('fixing').trigger('index', map, res.data.data, params)
          }
          if (res.data.ret === 1002) {
            alert(res.data.code)
          }

        })
      })
    },
    bindEvent(map, source, params) {
      $el.on('click', 'button', function (e) {
        let value = $el.find('.nav-search').val(),
          userInfo = utils.GetLoaclStorageUserInfo('userinfo')
        FIXING_API.GetFixingListForSearch({ adminId: userInfo.AdminId, query: value }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('fixing').trigger(utils.GetUrlParams(), map, res.data.data, params)
          }
          if (res.data.ret === 1002) {
            alert(res.data.code)
          }

        })
      })
    }
  }
})($('.search-container'))


// 列表Tab
var fixingListsTab = (function ($el) {
  Event.create('fixing').listen('common', function (map, source, params) {
    fixingListsTab.refresh(map, source, params)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindCommonEvent(map, source, params)
  })
  Event.create('fixing').listen('index', function (map, source, params) {
    fixingListsTab.refresh(map, source, params)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindIndexEvent(map, source, params)
  })
  Event.create('fixing').listen('control', function (map, source, params) {
    fixingListsTab.refresh(map, source, params)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindControlEvent(map, source, params)
  })
  Event.create('fixing').listen('trajectory', function (map, source, params, fixing) {
    fixingListsTab.refresh(map, source, params, fixing)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindTrajectoryEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('sportdata', function (map, source, params, fixing) {
    fixingListsTab.refresh(map, source, params, fixing)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindSportDataEvent(map, source, params, fixing)
  })

  return {
    unBindEvent() {
      $el.off('click')
    },
    bindCommonEvent(map, source, params) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('map').trigger('index', map, source, params)
        Event.create('fixing').trigger('index', map, source, params)
      })
    },
    bindIndexEvent(map, source, params) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('map').trigger('index', map, source, params)
        Event.create('fixing').trigger('index', map, source, params)
      })
    },
    bindControlEvent(map, source, params) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('fixing').trigger('control', map, source, params)
      })
    },
    bindTrajectoryEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('fixing').trigger('trajectory', map, source, params, fixing)
      })
    },
    bindSportDataEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('fixing').trigger('sportdata', map, source, params, fixing)
      })
    },
    refresh(map, source, params) {
      if (!source) source = []
      $el.html(`<li class="nav-item fixing-all"><a class="nav-link " href="#">全部（${source.length}）</a></li>
          <li class="nav-item fixing-online"><a class="nav-link " href="#" >在线（${utils.FilterFixingLists(source, 'entity_desc', '在线').length}）</a></li>
          <li class="nav-item fixing-offline"><a class="nav-link" href="#">离线（${utils.FilterFixingLists(source, 'entity_desc', '离线').length}）</a></li>`)
        // int tabIndex css
        .find('li')
        .addClass('text-muted')
        .eq(params.fixingListsTabIndex)
        .removeClass('text-muted')
        .addClass('border-bottom text-white')
    }
  }

})($('.nav-tab-container'))

// 鞋垫列表模块
var fixingLists = (function ($el) {
  Event.create('fixing').listen('index', function (map, source, params, fixing) {
    fixingLists.refresh(map, source, params, fixing)
    fixingLists.unBindEvent()
    fixingLists.bindIndexEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('control', function (map, source, params, fixing) {
    fixingLists.refresh(map, source, params, fixing)
    fixingLists.unBindEvent()
    fixingLists.bindControlEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('trajectory', function (map, source, params, fixing) {
    fixingLists.refresh(map, source, params, fixing)
    fixingLists.unBindEvent()
    fixingLists.bindTrajectoryEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('sportdata', function (map, source, params, fixing) {
    fixingLists.refresh(map, source, params, fixing)
    fixingLists.unBindEvent()
    fixingLists.bindSportdataEvent(map, source, params, fixing)
  })

  return {
    unBindEvent() {
      $el.off('click')
    },
    bindIndexEvent(map, source, params) {
      $el.on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        let { longitude, latitude } = item.latest_location, iconPath, marker,
          point = new BMap.Point(longitude, latitude)
        if (item.entity_desc === '在线') iconPath = '/assets/porint_online.png'
        if (item.entity_desc === '离线') iconPath = '/assets/porint_offline.png'
        marker = new BMap.Marker(point, { icon: new BMap.Icon(iconPath, new BMap.Size(31, 44)) })
        map.addOverlay(marker)
        Event.create('map').trigger('mapPanToMarkerPoint', map, point)
        Event.create('map').trigger('initMarkerInfoWindow', map, source, params, { fixingId: item.entity_name, point, isTrigger: true }, marker)
      })

    },
    bindControlEvent(map, source, params) {
      $el.on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        if (window.setIntervaler) {
          map.clearOverlays()
          clearInterval(window.setIntervaler)
        }
        let fixing = {
          point: new BMap.Point(item.latest_location.longitude, item.latest_location.latitude),
          fixingId: item.entity_name,
          type: 'init',
          isTrigger: true
        }

        Event.create('map').trigger('mapPanToMarkerPoint', map, fixing.point)
        Event.create('fixing').trigger('GetLastPosition', map, item, params, fixing)
        window.setIntervaler = setInterval(() => {
          fixing.type = 'update'
          fixing.isTrigger = false
          Event.create('fixing').trigger('GetLastPosition', map, item, params, fixing)
        }, 5000)
      })
    },
    bindTrajectoryEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        Event.create('fixing').trigger('GetTrackList', map, item, params, fixing)
      })
    },
    bindSportdataEvent(map, source, params, fixing) {
      $el.off('click').on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        Event.create('fixing').trigger('GetFixingSportData', map, item, params, fixing)
      })
    },
    refresh(map, source, params, fixing) {
      let cache = []

      // 仅处理展示前10/6条数据
      let handleToCaches = source => {
        if ((source.length / params.pageSize) < params.currentPage) {
          // url
          params.currentPage = 0
          utils.SetUrlParams(params)
        }
        let currentIndex = params.currentPage * params.pageSize
        for (let index = currentIndex; index < currentIndex + params.pageSize; index++) {
          if (source[index]) cache.push(source[index])
        }
      }
      if (params.fixingListsTabIndex === 0) handleToCaches(source)
      if (params.fixingListsTabIndex === 1) handleToCaches(onlineArrays = utils.FilterFixingLists(source, 'entity_desc', '在线'))
      if (params.fixingListsTabIndex === 2) handleToCaches(offlineArrays = utils.FilterFixingLists(source, 'entity_desc', '离线'))
      // 处理 cache 数据
      $el.html(cache.map((item, index) => {
        let img, activeTextColor = 'text-muted'
        // url fixingid css acitve
        if (fixing) {
          if (fixing.fixingId === item.entity_name) activeTextColor = 'text-white'
        }
        if (item.entity_desc === '在线') img = '/assets/porint_online.png'
        if (item.entity_desc === '离线') img = '/assets/porint_offline.png'
        let $tmp = $(`
              <li class="d-flex align-items-center justify-content-between m-2 p-2 pointer border-secondary ${activeTextColor}">
                <img src="${img}" title="abu" class="ml-3 mr-3" width="19" height="24">
                <p style="flex: 1;">${item.entity_name}</p>
                <p>${item.entity_desc}</p>
              </li>
            `).data(item)
        return $tmp
      }))

    }
  }
})($('.fixing-container'))

// 鞋垫列表分页
var fixingListsPagination = (function ($el) {
  Event.create('fixing').listen(utils.GetUrlPageName(), function (map, source, params, fixing) {
    fixingListsPagination.refresh(map, source, params, fixing)
  })

  return {
    refresh(map, source, params, fixing) {
      let cache = null
      // 根据 tabIndex 选择分组
      let hadnleToCache = source => {
        cache = Object.assign([], source)
        if ((source.length / params.pageSize) + 1 < params.currentPage) {
          params.currentPage = 0
        }
      }
      if (params.fixingListsTabIndex === 0) hadnleToCache(source)
      if (params.fixingListsTabIndex === 1) hadnleToCache(utils.FilterFixingLists(source, 'entity_desc', '在线'))
      if (params.fixingListsTabIndex === 2) hadnleToCache(utils.FilterFixingLists(source, 'entity_desc', '离线'))
      $el.jqPaginator({
        totalCounts: cache.length ? cache.length : 1,
        pageSize: params.pageSize,
        visiblePages: 5,
        currentPage: params.currentPage + 1,
        prev: '<li class="prev pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">&lt;</a></li>',
        next: '<li class="next pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">	&gt;</a></li>',
        page: '<li class="page pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
          if (type === 'init') return
          params.currentPage = num - 1
          utils.SetUrlParams(params)
          Event.create('fixing').trigger(utils.GetUrlPageName(), map, source, params, fixing)
        }
      })
    }
  }
})($('#pagination'))


// 鞋垫信息
var fixingInfo = (function ($el) {
  Event.create('fixing').listen('GetFixingInfo', function (map, source, fixing) {
    fixingInfo.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, { fixingId, infoWindow }) {
      // loacl 获取数据
      let { AdminId } = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetFixingInfo({ adminId: AdminId, fixingId }).then(res => {
        let { bindingList, fixinginfo } = res.data, bindingListContent
        let activatedTime = utils.handleTimestampToDate(fixinginfo.activatedTime),
          createTime = utils.handleTimestampToDate(fixinginfo.createTime),
          expireTime = utils.handleTimestampToDate(fixinginfo.expireTime),
          mode = fixinginfo.mode === '1' ? '开机' : '关机'
        // 更新窗口对象HTML信息
        infoWindow.setWidth(760)
        if (bindingList) {
          bindingListContent = `
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
              <tbody>
              ${bindingList.map(item => {
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
            }).join(' ')}
              </tbody>
            </table>`
        } else {
          bindingListContent = '<h5 class="d-flex align-items-center">该设备未绑定</h5>'
        }
        infoWindow.setContent(`<div>
        <div class="d-flex text-white">
          <div class="base-container mr-2">
            <h5 class="normal mb-3">基本信息</h5>
            <div style="background-color: #151934; width: 230px;" class="p-3">
              <div class="pt-3 pb-3">
                <h6 class="normal d-flex justify-content-between">${fixingId}
                  <span>${mode}</span>
                </h6>
                <p class="p text-muted d-flex justify-content-between">鞋垫ID
                  <span>鞋垫状态</span>
                </p>
              </div>
              <div class="pt-3 pb-3">
                <h6 class="normal d-flex justify-content-between">${fixinginfo.batchId}
                  <span>${fixinginfo.emergencyContact}</span>
                </h6>
                <p class="p text-muted d-flex justify-content-between">产品批次
                  <span>紧急联系人</span>
                </p>
              </div>
              <div class="pt-3 pb-3">
                <h6 class="normal d-flex justify-content-between">${createTime}
                  <span>${expireTime}</span>
                </h6>
                <p class="p text-muted d-flex justify-content-between">生产时间
                  <span>月卡时间</span>
                </p>
              </div>
              <div class="pt-3 pb-3">
                <h6 class="normal d-flex justify-content-start">${activatedTime}
                </h6>
                <p class="p text-muted d-flex justify-content-between">激活时间
                </p>
              </div>
              <div class="pt-3 pb-3">
              <h6 class="normal d-flex justify-content-start">${fixinginfo.sms}
              </h6>
              <p class="p text-muted d-flex justify-content-start">
                <span>服务手机号</span>
              </p>
            </div>
            </div>
          </div>
          <div class="bing-container d-flex flex-column" style="flex: 1;">
          <h5 class="normal mb-3">绑定者信息</h5>
          <div class="d-flex justify-content-center" style="background-color: #151934; flex: 1;">
            ${bindingListContent}
            </div>
          </div>
        </div>
        </div>`)
      })
    }
  }
})()

// 鞋垫指令
var fixingInstructions = (function ($el) {
  Event.create('fixing').listen('AdminGetInstructionsList', function (map, source, fixing) {
    fixingInstructions.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, { infoWindow, fixingId }) {
      // loacl 获取数据
      let { AdminId } = utils.GetLoaclStorageUserInfo('userinfo'),
        time = utils.handleTimestampToDate(new Date())
      FIXING_API.AdminGetInstructions({ adminId: AdminId, fixingId, time }).then(res => {
        let instructions = res.data.data,
          instructionsContent = instructions.map(item => {
            return `<li class="mb-3 d-flex flex-row instruction-item"><p class="time text-muted" style="width: 100px;">${item.shijian}</p>
            <p class="ml-4 breakAll" style="flex: 1;">${item.content}</p></li>`
          }).join('')
        infoWindow.setWidth(680)
        infoWindow.setContent(`
                <h5 class="normal text-white mb-3">指令回复</h5>
                <ul class="instructions-container">
                  ${instructionsContent}
                </ul>
          `)
      })
    }
  }
})()

// 鞋垫二维码
var fixingQRCode = (function ($el) {
  Event.create('fixing').listen('GetFixingQRCode', function (map, source, fixing) {
    fixingQRCode.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, { infoWindow, fixingId }) {
      // loacl 获取数据
      let { AdminId } = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetFixingQRCode({ adminId: AdminId, fixingId }).then(res => {
        infoWindow.setWidth(485)
        infoWindow.setContent(`<h5 class="normal mb-3">二维码</h5>
        <div class="bg-white" style="width: 318px; height: 318px;">
        <div id="qrcode" class="qrcode d-flex justify-content-center justify-content-cetner p-5">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=218x218&data=${res.data}" width="218" height="218" />
        </div>
        </div>`)
      })
    }
  }
})()

// 鞋垫信息实时
var fixingInfoLive = (function ($el) {
  Event.create('fixing').listen('GetLastPosition', function (map, item, params, fixing) {
    fixingInfoLive.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      if (fixing.type === 'init') $el.empty()

      // loacl 获取数据
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      // 请求最后位置信息接口
      FIXING_API.GetLastPosition({ adminId: userInfo.AdminId, fixingId: item.entity_name }).then(res => {
        if (res.data.ret === 1001) {

          let address = res.data.address,
            charge = res.data.charge === '1' ? '充电中' : '未充电',
            createTime = utils.handleTimestampToDateTime(res.data.createTime),
            electricity = res.data.electricity, // 电量
            mode = res.data.mode,
            modestatus = res.data.modestatus === '1' ? '正常模式' : '追踪模式',
            positions = res.data.positions.split(','),
            lng = utils.handleToCut(positions[0], 4),
            lat = utils.handleToCut(positions[1], 4),
            shutdown = res.data.shutdown === '0' ? '关机' : '开机',
            status = res.data.status === '1' ? '运动' : '静止',
            iconPath, marker


          if (item.entity_desc === '在线') iconPath = '/assets/porint_online.png'
          if (item.entity_desc === '离线') iconPath = '/assets/porint_offline.png'
          fixing.point = new BMap.Point(lng, lat)
          marker = new BMap.Marker(fixing.point, { icon: new BMap.Icon(iconPath, new BMap.Size(31, 44)) })
          map.addOverlay(marker)

          $el.append(`
          <tr>
            <th scope="row" class="normal pt-4 pb-4 text-center">${shutdown}</th>
            <td class="normal pt-4 pb-4 text-center">${mode}</td>
            <td class="normal pt-4 pb-4 text-center">${item.entity_name}</td>
            <td class="normal pt-4 pb-4 text-center">${createTime}</td>
            <td class="normal pt-4 pb-4 text-center">${charge}</td>
            <td class="normal pt-4 pb-4 text-center">${electricity}%</td>
            <td class="normal pt-4 pb-4 text-center">${modestatus}</td>
            <td class="normal pt-4 pb-4 text-center">${status}</td>
            <td class="normal pt-4 pb-4 text-center">${lng}, ${lat}</td>
            <td class="normal pt-4 pb-4 text-center">${address}</td>
          </tr>
          `)

          $el.off('mouseenter mouseleave').on('mouseenter mouseleave', 'tr', function (e) {
            $(e.currentTarget).addClass('active').siblings().removeClass('active')
          })
          Event.create('map').trigger('controlMarkerInfoWindow', map, res.data, params, fixing, marker)
        }
        if (res.data.ret === 1003) {
          alert(res.data.code)
        }
      })
    }
  }
})($('.live-info-tbody'))

// 轨迹信息
var fixinTrajectory = (function ($el) {
  Event.create('fixing').listen('GetTrackList', function (map, item, params, fixing) {
    fixinTrajectory.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      $el.empty()
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetTrackList({ adminId: userInfo.AdminId, fixingId: item.entity_name, time: fixing.currentTime }).then(res => {
        if (res.data.ret === 1001) {
          $el.append(res.data.data.map(innerItem => {
            let address = innerItem.address,
              charge = innerItem.charge === '1' ? '充电中' : '未充电',
              createTime = innerItem.create_time,
              electricity = `${innerItem.electricity}%`, // 电量
              longitude = utils.handleToCut(innerItem.longitude, 4),
              latitude = utils.handleToCut(innerItem.latitude, 4),
              mode = innerItem.mode,
              modestatus = innerItem.modestatus === '1' ? '正常模式' : '追踪模式',
              shutdown = innerItem.shutdown === '0' ? '关机' : '开机',
              status = innerItem.status === '1' ? '运动' : '静止'

            return $(`
            <tr>
                <th scope="row" class="normal pt-4 pb-4 text-center">${shutdown}</th>
                <td class="normal pt-4 pb-4 text-center">${mode}</td>
                <td class="normal pt-4 pb-4 text-center">${item.entity_name}</td>
                <td class="normal pt-4 pb-4 text-center">${createTime}</td>
                <td class="normal pt-4 pb-4 text-center">${charge}</td>
                <td class="normal pt-4 pb-4 text-center">${electricity}</td>
                <td class="normal pt-4 pb-4 text-center">${modestatus}</td>
                <td class="normal pt-4 pb-4 text-center">${status}</td>
                <td class="normal pt-4 pb-4 text-center">${longitude}, ${latitude}</td>
                <td class="normal pt-4 pb-4 text-center">${address}</td>
              </tr>
              `).off('click').on('click', function (e) {
                $(this).addClass('active').siblings().removeClass('active')
                fixing.fixingId = item.entity_name
                Event.create('map').trigger('trajectoryMarkerInfoWindow', map, innerItem, params, fixing)
              })
          }))

          Event.create('map').trigger('GetTrackList', map, res.data.data, params, fixing)
        }
        if (res.data.ret === 1002) {
          alert(res.data.code)
        }
      })
    }
  }
})($('.track-list-tbody'))


var fixingDatepicker = (function ($el) {
  Event.create('fixing').listen('GetTrackList', function (map, item, params, fixing) {
    fixingDatepicker.refresh(map, item, params, fixing)
  })
  return {
    refresh(map, item, params, fixing) {
      $el.off('changeDate').on('changeDate', function (e) {
        fixing.currentTime = utils.handleTimestampToDate($el.datepicker('getDate'))
        Event.create('fixing').trigger('GetTrackList', map, item, params, fixing)
      })
    }
  }
})($('#datepicker'))

var sportData = (function ($el) {
  let
    stepsOption = {
      title: {
        top: 5,
        left: 'center',
        text: '计步数据',
        subtext: 'steps'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
      },
      xAxis: { data: [] },
      yAxis: {},
      series: [{
        type: 'line',
        data: []
      }]
    },
    caloriesOption = {
      title: {
        top: 5,
        left: 'center',
        text: '卡路里数据',
        subtext: 'calories'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
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
        top: 5,
        left: 'center',
        text: '体重数据',
        subtext: 'weight'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
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
        top: 5,
        left: 'center',
        text: '距离数据',
        subtext: 'distance'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
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
  Event.create('fixing').listen('GetFixingSportData', function (map, item, params, fixing) {
    sportData.refresh(map, item, params, fixing)
  })

  Event.create('fixing').listen('initFixingSportData', function (map, item, params, fixing) {
    sportData.initFixingSportData(map, item, params, fixing)
  })
  return {
    refresh(map, item, params, fixing) {
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetFixingSportData({ adminId: userInfo.AdminId, fixingId: item.entity_name, times: utils.handleTimeToUnix(fixing.currentTime) }).then(res => {
        console.log(item)
        if (res.data.ret === 1001) {
          let xAxisArrays = [], stepsArrays = [], caloriesArrays = [], weightArrays = [], distanceArrays = []

          res.data.sportList.forEach(item => {
            let xAxis = `${utils.handleToYYYYMMDD(new Date(Number.parseInt(item.createTime + '000'))).DD}日`
            xAxisArrays.push(xAxis)
            stepsArrays.push({
              name: item.steps,
              value: item.steps
            })
            caloriesArrays.push({
              name: item.calorie,
              value: item.calorie
            })
            weightArrays.push({
              name: item.weight,
              value: item.weight
            })
            distanceArrays.push({
              name: item.distance,
              value: item.distance
            })
          })
          stepsOption.xAxis.data = caloriesOption.xAxis.data = weightOption.xAxis.data = distanceOption.xAxis.data = xAxisArrays
          stepsOption.series[0].data = stepsArrays
          caloriesOption.series[0].data = caloriesArrays
          weightOption.series[0].data = weightArrays
          distanceOption.series[0].data = distanceArrays
          // update
          fixing.steps.setOption(stepsOption)
          fixing.calorie.setOption(caloriesOption)
          fixing.weight.setOption(weightOption)
          fixing.distance.setOption(distanceOption)
        }
        if (res.data.ret === 1002) {
          alert(res.data.code)
        }
      })
    },
    initFixingSportData(map, source, params, fixing) {
      let xAxisArrays = [], stepsArrays = [], caloriesArrays = [], weightArrays = [], distanceArrays = [];


      [
        utils.handleToCut(Math.random() * 100, 0),
        utils.handleToCut(Math.random() * 100, 0),
        utils.handleToCut(Math.random() * 100, 0),
        utils.handleToCut(Math.random() * 100, 0),
        utils.handleToCut(Math.random() * 100, 0)
      ].forEach(item => {
        let xAxis = `${utils.handleToYYYYMMDD(new Date()).DD}日`
        xAxisArrays.push(xAxis)
        stepsArrays.push({
          name: item,
          value: item
        })
        caloriesArrays.push({
          name: item,
          value: item
        })
        weightArrays.push({
          name: item,
          value: item
        })
        distanceArrays.push({
          name: item,
          value: item
        })
      })
      stepsOption.xAxis.data = caloriesOption.xAxis.data = weightOption.xAxis.data = distanceOption.xAxis.data = xAxisArrays
      stepsOption.series[0].data = stepsArrays
      caloriesOption.series[0].data = caloriesArrays
      weightOption.series[0].data = weightArrays
      distanceOption.series[0].data = distanceArrays
      fixing.steps = echarts.init(document.getElementById('steps'), 'bigdata')
      fixing.calorie = echarts.init(document.getElementById('calorie'), 'bigdata')
      fixing.weight = echarts.init(document.getElementById('weight'), 'bigdata')
      fixing.distance = echarts.init(document.getElementById('distance'), 'bigdata')
      fixing.steps.setOption(stepsOption)
      fixing.calorie.setOption(caloriesOption)
      fixing.weight.setOption(weightOption)
      fixing.distance.setOption(distanceOption)
    }
  }
})()



var sportDataDatepicker = (function ($el) {
  Event.create('fixing').listen('GetFixingSportData', function (map, item, params, fixing) {
    sportDataDatepicker.refresh(map, item, params, fixing)
  })
  return {
    refresh(map, item, params, fixing) {
      $el.off('changeDate').one('changeDate', function (e) {
        fixing.currentTime = utils.handleTimestampToDate($el.datepicker('getDate'))
        Event.create('fixing').trigger('GetFixingSportData', map, item, params, fixing)
      })
    }
  }
})($('#datepicker'))