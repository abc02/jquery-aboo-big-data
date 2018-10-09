// 搜索
var fixingSearch = (function ($el) {
  Event.create('fixing').listen('index', function (map, source, fixing) {
    fixingSearch.refresh(map, source, fixing)
  })
  Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
    fixingSearch.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      $el.off('click').on('click', 'button', function (e) {
        let value = $el.find('.nav-search').val(),
          userInfo = utils.GetLoaclStorageUserInfo('userinfo'),
          params = utils.GetUrlParams()
        if (!value) {
          FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
            Event.create('map').trigger('GetFixingList', map, res.data.data, params)
            Event.create('fixing').trigger('GetFixingListSuccess', map, res.data.data, params)
          })
          return
        }

        FIXING_API.GetFixingListForSearch({ adminId: userInfo.AdminId, query: value }).then(res => {
          Event.create('map').trigger('GetFixingList', map, res.data.data, params)
          Event.create('fixing').trigger('GetFixingListSuccess', map, res.data.data, params)
        })
      })
    }
  }
})($('.search-container'))


// 列表Tab
var fixingListsTab = (function ($el) {
  Event.create('fixing').listen('index', function (map, source, fixing) {
    fixingListsTab.refresh(map, source, fixing)
  })
  Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
    fixingListsTab.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      let pageName = utils.GetUrlPageName(),
        params = utils.GetUrlParams()
      $el.html(`<li class="nav-item fixing-all"><a class="nav-link " href="#">全部（${source.length}）</a></li>
          <li class="nav-item fixing-online"><a class="nav-link " href="#" >在线（${utils.FilterFixingLists(source, 'entity_desc', '在线').length}）</a></li>
          <li class="nav-item fixing-offline"><a class="nav-link" href="#">离线（${utils.FilterFixingLists(source, 'entity_desc', '离线').length}）</a></li>`)
        .off('click')
        .on('click', 'li', function (e) {
          // update tabindex css
          $(e.currentTarget)
            .siblings()
            .removeClass('text-muted')
            .addClass('border-bottom text-white')

          // // update map fixing
          // switch (pageName) {
          //   case '':
          //     Event.create('map').trigger('GetFixingList', map, source, fixing)
          //     break;
          //   case 'index.html':
          //     Event.create('map').trigger('GetFixingList', map, source, fixing)
          //     break;
          //   case 'control.html':
          //     Event.create('map').trigger('GetFixingListOnce', map, utils.FilterFxingListUrl(source), fixing)
          //     break;
          // }
          params.fixingListsTabIndex = $(e.currentTarget).index()
          console.log(params)
          utils.SetUrlParams(params)
          Event.create('map').trigger('GetFixingList', map, source, params)
          Event.create('fixing').trigger('index', map, source, params)
        })
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
  Event.create('fixing').listen('index', function (map, source, fixing) {
    fixingLists.refresh(map, source, fixing)
    fixingLists.indexEvent(map, source, fixing)
  })
  Event.create('fixing').listen('control', function (map, source, fixing) {
    fixingLists.refresh(map, source, fixing)
    fxingLists.controlEvent(map, source, fixing)
  })
  Event.create('fixing').listen('trajectory', function (map, source, fixing) {
    fixingLists.refresh(map, source, fixing)
    fxingLists.trajectoryEvent(map, source, fixing)
  })
  Event.create('fixing').listen('sportdata', function (map, source, fixing) {
    fixingLists.refresh(map, source, fixing)
    fxingLists.sportdataEvent(map, source, fixing)
  })
  Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
    fixingLists.refresh(map, source, fixing)
  })
  return {
    indexEvent(map, source, fixing) {
      $el.off('click').on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        // update fixingid
        fixing.fixingId = item.entity_name
        utils.SetUrlParams(fixing)
        Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: item.latest_location.longitude, lat: item.latest_location.latitude })
      })

    },
    controlEvent(map, source, fixing) {
      $el.off('click').on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        // update fixingid
        fixing.fixingId = entity_name
        utils.SetUrlParams(fixing)

        // 覆盖物单个once
        clearInterval(window.setIntervaler)
        let fixingOnce = utils.FilterFxingListUrl(source)
        Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: item.latest_location.longitude, lat: item.latest_location.latitude })
        Event.create('map').trigger('GetFixingListOnce', map, fixingOnce, { ...params, type: 'init' })
        Event.create('fixing').trigger('GetLastPosition', map, fixingOnce, { ...params, type: 'init' })
        window.setIntervaler = setInterval(function () {
          Event.create('map').trigger('GetFixingListOnce', map, fixingOnce, { ...params, type: 'update' })
          Event.create('fixing').trigger('GetLastPosition', map, fixingOnce, { ...params, type: 'update' })
        }, 60000)
        Event.create('map').trigger('GetFixingListOnce', map, fixingOnce, { ...params, type: 'init' })
        // BMapLib.EventWrapper.trigger(marker, "click")
      })
    },
    trajectoryEvent(map, source, fixing) {
      $el.off('click').on('click', 'li', function (e) {
        let item = $(e.currentTarget).data(),
          userInfo = utils.GetLoaclStorageUserInfo('userinfo'),
          timeData
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')
        // update fixingid
        fixing.fixingId = entity_name
        utils.SetUrlParams(fixing)

        map.clearOverlays()
        timeData = $('#datepicker').datepicker('getDate')
        $('#datepicker').attr('value', utils.handleTimestampToDate(params.time))
        params = utils.GetUrlParams()
        if (!params.time) params.time = Math.round(new Date(data) / 1000) // update 日期
        utils.SetUrlParams(params)
        FIXING_API.GetTrackList({ adminId: userInfo.AdminId, fixingId: params.fixingId, time: utils.handleTimestampToDate(params.time) }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('map').trigger('GetTrackList', map, res.data.data, params)
            Event.create('fixing').trigger('GetTrackList', map, res.data.data, params)
          }
          if (res.data.ret === 1002) {
            Event.create('map').trigger('GetTrackList', map, null, params)
            Event.create('fixing').trigger('GetTrackList', map, null, params)
            window.alert(res.data.code)
          }
        })
        // BMapLib.EventWrapper.trigger(marker, "click")
      })
    },
    sportdataEvent(map, source, fixing) {
      $el.off('click').on('click', 'li', function (e) {
        let item = $(e.currentTarget).data(),
          userInfo = utils.GetLoaclStorageUserInfo('userinfo'),
          timeData
        // update fixingid
        fixing.fixingId = entity_name
        utils.SetUrlParams(fixing)

        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')


        timeData = $('#datepicker').datepicker('getDate')
        params = utils.GetUrlParams()
        if (!params.time) params.time = Math.round(new Date(data) / 1000) // update 日期
        $('#datepicker').attr('value', utils.handleTimestampToDate(params.time))
        utils.SetUrlParams(params)
        FIXING_API.GetFixingSportData({ adminId: userInfo.AdminId, fixingId: params.fixingId, times: params.time }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('sportData').trigger('GetFixingSportData', null, res.data, params)
          }
          if (res.data.ret === 1002) {
            Event.create('sportData').trigger('GetFixingSportData', null, null, params)
            window.alert(res.data.code)
          }
        })
        // BMapLib.EventWrapper.trigger(marker, "click")
      })
    },
    refresh(map, source, fixing) {
      let cache = [],
        params = utils.GetUrlParams(),
        currentPage = Number.parseInt(params.currentPage),
        pageSize = Number.parseInt(params.pageSize),
        fixingListsTabIndex = Number.parseInt(params.fixingListsTabIndex)

      // 仅处理展示前10/6条数据
      let handleToCaches = source => {
        if ((source.length / pageSize) < currentPage) {
          // url
          params.currentPage = currentPage = 0
          utils.SetUrlParams(params)
        }
        for (let index = currentPage * pageSize; index < (currentPage * pageSize) + pageSize; index++) {
          if (source[index]) cache.push(source[index])
        }
      }
      switch (fixingListsTabIndex) {
        case 0:
          handleToCaches(source)
          break;
        case 1:
          handleToCaches(onlineArrays = utils.FilterFixingLists(source, 'entity_desc', '在线'))
          break;
        case 2:
          handleToCaches(offlineArrays = utils.FilterFixingLists(source, 'entity_desc', '离线'))
          break;
        default:
          handleToCaches(source)
          break;
      }
      // 处理 cache 数据
      $el.html(cache.map((item, index) => {
        let img, activeTextColor = 'text-muted'
        // url fixingid css acitve
        if (params.fixingId) {
          if (params.fixingId === item.entity_name) {
            activeTextColor = 'text-white'
          }
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

// 鞋垫列表分页模块
var fixingListsPagination = (function ($el) {
  Event.create('fixing').listen('index', function (map, source, fixing) {
    fixingListsPagination.refresh(map, source, fixing)
  })
  Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
    fixingListsPagination.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      let cache = null,
        allArrays = Object.assign([], source),
        onlineArrays = utils.FilterFixingLists(source, 'entity_desc', '在线'),
        offlineArrays = utils.FilterFixingLists(source, 'entity_desc', '离线'),
        params = utils.GetUrlParams(),
        fixingListsTabIndex = Number.parseInt(params.fixingListsTabIndex),
        pageSize = Number.parseInt(fixing.pageSize),
        currentPage = Number.parseInt(fixing.currentPage) + 1
      // 根据 tabIndex 选择分组
      let hadnleToCache = source => {
        cache = source
        if ((source.length / pageSize) + 1 < currentPage) {
          currentPage = 1
        }
      }
      switch (fixingListsTabIndex) {
        case 0:
          hadnleToCache(allArrays)
          break;
        case 1:
          hadnleToCache(onlineArrays)
          break;
        case 2:
          hadnleToCache(offlineArrays)
          break;
        default:
          hadnleToCache(allArrays)
          break;
      }
      $el.jqPaginator({
        totalCounts: cache.length ? cache.length : 1,
        pageSize,
        visiblePages: 5,
        currentPage,
        prev: '<li class="prev pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">&lt;</a></li>',
        next: '<li class="next pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">	&gt;</a></li>',
        page: '<li class="page pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
          if (type === 'init') return
          params.currentPage = num - 1
          utils.SetUrlParams(params)
          Event.create('fixing').trigger('GetFixingList', map, source, params)
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

// 鞋垫信息实时模块
var fixingInfoLive = (function ($el) {
  Event.create('fixing').listen('GetLastPosition', function (map, source, fixing) {
    fixingInfoLive.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, fixing) {
      if (fixing.type === 'init') $el.empty()
      // loacl 获取数据
      let { AdminId } = utils.GetLoaclStorageUserInfo('userinfo')
      // 请求最后位置信息接口
      FIXING_API.GetLastPosition({ adminId: AdminId, fixingId: fixing.fixingId }).then(res => {
        let positions = res.data.positions.split(','),
          shutdown = res.data.shutdown === '0' ? '关机' : '开机',
          lng = utils.handleToCut(positions[0]),
          lat = utils.handleToCut(positions[1]),
          createTime = utils.handleTimestampToDateTime(res.data.createTime),
          charge = res.data.charge === '1' ? '充电中' : '未充电',
          modestatus = res.data.modestatus === '1' ? '正常模式' : '追踪模式',
          status = res.data.status === '1' ? '运动' : '静止'
        $el.append(`
        <tr>
          <th scope="row" class="normal pt-4 pb-4 text-center">${shutdown}</th>
          <td class="normal pt-4 pb-4 text-center">${res.data.mode}</td>
          <td class="normal pt-4 pb-4 text-center">${fixing.fixingId}</td>
          <td class="normal pt-4 pb-4 text-center">${createTime}</td>
          <td class="normal pt-4 pb-4 text-center">${res.data.address}</td>
          <td class="normal pt-4 pb-4 text-center">${res.data.code}</td>
        </tr>
        `)
        $el.off('mouseenter mouseleave').on('mouseenter mouseleave', 'tr', function (e) {
          $(e.currentTarget).addClass('active').siblings().removeClass('active')
          // Event.create('map').trigger('GetFixingListOnce', map, source, { ...res.data, ...fixing })
        })
      })
    }
  }
})($('.live-info-tbody'))

// 鞋垫历史轨迹信息模块
var fixinTrajectory = (function ($el) {
  Event.create('fixing').listen('GetTrackList', function (map, source, fixing) {
    fixinTrajectory.refresh(map, source, fixing)
  })

  return {
    refresh(map, source, fixing) {
      $el.empty()
      if (!source) {
        return
      }
      let $contents = source.map(item => {
        let { address, create_time, mode } = item
        return $(`<tr>
            <th scope="row" class="normal pt-4 pb-4 text-center">在线</th>
            <td class="normal pt-4 pb-4 text-center">${mode}</td>
            <td class="normal pt-4 pb-4 text-center">${fixing.fixingId}</td>
            <td class="normal pt-4 pb-4 text-center">${create_time}</td>
            <td class="normal pt-4 pb-4 text-center breakword" style="width: 620px;">${address}</td>
            <td class="normal pt-4 pb-4 text-center">定位成功</td>
          </tr>
          `).off('click').on('click', function (e) {
            $(this).addClass('active').siblings().removeClass('active')
            let address = item.address,
              charge = item.charge === '1' ? '充电中' : '未充电',
              createTime = item.create_time,
              electricity = item.electricity, // 电量
              longitude = utils.handleToCut(item.longitude),
              latitude = utils.handleToCut(item.latitude),
              mode = item.mode,
              modestatus = item.modestatus === '1' ? '正常模式' : '追踪模式',
              radius = item.radius,
              shutdown = item.shutdown === '0' ? '关机' : '开机',
              status = item.status === '1' ? '运动' : '静止',
              point = new BMap.Point(longitude, latitude)


            let opts = { width: 458 },
              infoWindow = new BMap.InfoWindow(` <div class='bg-dark' id='markerinfo'>
              <h5 class='d-flex justify-content-between text-white mb-2'><p>鞋垫ID：<span class="fixingid">${fixing.fixingId}</span></p>
              </h5>
              <div class='d-flex flex-row color-drak mb-2'>
                <p style='flex: 1;'><span class='mr-2'>描述 </span><span class='text-white shutdown'>${shutdown}<span></p>
                <p style='flex: 1;'><span class='mr-2'>定位类型 </span><span class='color-white mode'>${mode}</span></p>
              </div>
              <div class='d-flex flex-row color-drak mb-2'>
                <p style='flex: 1;'><span class='mr-2'>充电状态 </span><span class='text-white charge'>${charge}<span></p>
                <p style='flex: 1;'><span class='mr-2'>当前模式 </span><span class='color-white modestatus'>${modestatus}</span></p>
              </div>
              <div class='d-flex flex-row color-drak mb-2'>
              <p style='flex: 1;'><span class='mr-2'>精度 </span><span class='text-white radius'>${radius}<span></p>
              <p style='flex: 1;'><span class='mr-2'>状态 </span><span class='color-white status'>${status}</span></p>
            </div>
              <div class='d-flex flex-row color-drak mb-2'>
                <p style='flex: 1;'><span class='mr-2'>经纬度 </span><span class='text-white positions'>${latitude}, ${longitude}</span></p>
                <p style='flex: 1;'><span class='mr-2'>定位时间 </span><span class='text-white createTime'>${createTime}</span></p>
              </div>
              <div class='d-flex flex-row color-drak mb-4'>
                <p style='flex: 1;'><spann class='mr-2'>位置 </span><span class='text-white address'>${address}</span></p>
              </div>
            </div>`, opts)

            map.openInfoWindow(infoWindow, point)
            // Event.create('map').trigger('mapInitInfoWindow', map, source, fixing)
          })
      })
      $el.append($contents)
    }
  }
})($('.track-list-tbody'))


var fixingDatepicker = (function ($el) {
  Event.create('fixing').listen('GetTrackList', function (map, source, fixing) {
    fixingDatepicker.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      $el.off('changeDate').one('changeDate', function (e) {
        map.clearOverlays()
        // loacl 获取数据
        let userInfo = utils.GetLoaclStorageUserInfo('userinfo'),
          data = $('#datepicker').datepicker('getDate'),
          params = utils.GetUrlParams()
        params.time = Math.round(new Date(data) / 1000) // update 日期
        utils.SetUrlParams(params)
        $('#datepicker').attr('value', utils.handleTimestampToDate(params.time))
        // 请求轨迹接口
        FIXING_API.GetTrackList({ adminId: userInfo.AdminId, fixingId: params.fixingId, time: utils.handleTimestampToDate(params.time) }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('map').trigger('GetTrackList', map, res.data.data, params)
            Event.create('fixing').trigger('GetTrackList', map, res.data.data, params)
          }
          if (res.data.ret === 1002) {
            Event.create('map').trigger('GetTrackList', map, null, params)
            Event.create('fixing').trigger('GetTrackList', map, null, params)
            window.alert(res.data.code)
          }
        })
      })
    }
  }
})($('#datepicker'))