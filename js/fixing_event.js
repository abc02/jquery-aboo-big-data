var sliderDoork = (function ($el) {
  Event.create('fixing').listen(utils.GetUrlPageName(), function (map, source, params, fixing) {
    sliderDoork.refresh(map, source, params, fixing)
  })
  // Event.create('fixing').listen('control', function (map, source, params, fixing) {
  //   sliderDoork.refresh(map, source, params, fixing)
  // })
  // Event.create('fixing').listen('trajectory', function (map, source, params, fixing) {
  //   sliderDoork.refresh(map, source, params, fixing)
  // })
  // Event.create('fixing').listen('sportdata', function (map, source, params, fixing) {
  //   sliderDoork.refresh(map, source, params, fixing)
  // })

  return {
    refresh(map, source, params, fixing) {
      $el.off('click').on('click', e => {
        if ($(e.currentTarget).find('img').attr('src') === '/assets/extension_left.png') {
          $(e.currentTarget).find('img').attr('src', '/assets/extension_right.png')
        } else {
          $(e.currentTarget).find('img').attr('src', '/assets/extension_left.png')
        }
        $('.slider-dialog').toggle()
      })
    }
  }
})($('.slider-doork'))

var bottomDoork = (function ($el) {
  Event.create('fixing').listen('control', function (map, source, params, fixing) {
    bottomDoork.refresh(map, source, params, fixing)
  })
  Event.create('fixing').listen('trajectory', function (map, source, params, fixing) {
    bottomDoork.refresh(map, source, params, fixing)
  })

  return {
    refresh(map, source, params, fixing) {
      $el.off('click').on('click', e => {
        $('.bottom-container').hide()
        $('.bottom-doork-map').show()
        if (utils.GetUrlPageName() === 'control') params.pageSize = 12
        if (utils.GetUrlPageName() === 'trajectory') params.pageSize = 14
        Event.create('fixing').trigger(utils.GetUrlPageName(), map, source, params, fixing)
      })
    }
  }
})($('.bottom-container-doork'))

var mapDoork = (function ($el) {
  Event.create('fixing').listen('control', function (map, source, params, fixing) {
    mapDoork.refresh(map, source, params, fixing)
  })
  Event.create('fixing').listen('trajectory', function (map, source, params, fixing) {
    mapDoork.refresh(map, source, params, fixing)
  })

  return {
    refresh(map, source, params, fixing) {
      $el.off('click').on('click', e => {
        $('.bottom-container').show()
        $(e.currentTarget).hide()
        if (utils.GetUrlPageName() === 'control') params.pageSize = 5
        if (utils.GetUrlPageName() === 'trajectory') params.pageSize = 6
        Event.create('fixing').trigger(utils.GetUrlPageName(), map, source, params, fixing)
      })
    }
  }
})($('.bottom-doork-map'))

// 搜索
var fixingSearch = (function ($el) {
  Event.create('fixing').listen('index', function (map, source, params, fixing) {
    fixingSearch.bindIndexEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('control', function (map, source, params, fixing) {
    fixingSearch.bindEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('trajectory', function (map, source, params, fixing) {
    fixingSearch.bindEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('sportdata', function (map, source, params, fixing) {
    fixingSearch.bindEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('sms', function (map, source, params, fixing) {
    fixingSearch.bindEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('print-center', function (map, source, params, fixing) {
    fixingSearch.bindEvent(map, source, params, fixing)
  })
  return {
    unBindEvent() {
      $el
    },
    bindIndexEvent(map, source, params, fixing) {
      $el.off('click').on('click', 'button', function (e) {
        let value = $el.find('.nav-search').val(),
          userInfo = utils.GetLoaclStorageUserInfo('userinfo')
        FIXING_API.GetFixingListForSearch({ adminId: userInfo.AdminId, query: value }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('map').trigger('index', map, res.data.data, params, fixing)
            Event.create('fixing').trigger('index', map, res.data.data, params, fixing)
          }
          if (res.data.ret === 1002) {
            $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
            $('#no-data-ModalCenter').modal('show')
          }

        })
      })
    },
    bindEvent(map, source, params, fixing) {
      $el.off('click').on('click', 'button', function (e) {
        let value = $el.find('.nav-search').val(),
          userInfo = utils.GetLoaclStorageUserInfo('userinfo')
        FIXING_API.GetFixingListForSearch({ adminId: userInfo.AdminId, query: value }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('fixing').trigger(utils.GetUrlPageName(), map, res.data.data, params, fixing)
          }
          if (res.data.ret === 1002) {
            $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
            $('#no-data-ModalCenter').modal('show')
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
  Event.create('fixing').listen('index', function (map, source, params, fixing) {
    fixingListsTab.refresh(map, source, params, fixing)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindIndexEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('control', function (map, source, params, fixing) {
    fixingListsTab.refresh(map, source, params, fixing)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindControlEvent(map, source, params, fixing)
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
  Event.create('fixing').listen('sms', function (map, source, params, fixing) {
    fixingListsTab.refresh(map, source, params, fixing)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindSMSEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('print-center', function (map, source, params, fixing) {
    fixingListsTab.refresh(map, source, params, fixing)
    fixingListsTab.unBindEvent()
    fixingListsTab.bindPrintCenterEvent(map, source, params, fixing)
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
    bindIndexEvent(map, source, params, fixing) {
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
        Event.create('fixing').trigger('index', map, source, params, fixing)
      })
    },
    bindControlEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('fixing').trigger('control', map, source, params, fixing)
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
    bindSMSEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('fixing').trigger('sms', map, source, params, fixing)
      })
    },
    bindPrintCenterEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        // update tabindex css
        $(e.currentTarget)
          .addClass('border-bottom text-white')
          .siblings()
          .addClass('text-muted')
          .removeClass('border-bottom text-white')
        params.fixingListsTabIndex = $(e.currentTarget).index()
        utils.SetUrlParams(params)
        Event.create('fixing').trigger('print-center', map, source, params, fixing)
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
  Event.create('fixing').listen('sms', function (map, source, params, fixing) {
    fixingLists.refresh(map, source, params, fixing)
    fixingLists.unBindEvent()
    fixingLists.bindSMSEvent(map, source, params, fixing)
  })
  Event.create('fixing').listen('print-center', function (map, source, params, fixing) {
    fixingLists.refresh(map, source, params, fixing)
    fixingLists.unBindEvent()
    fixingLists.bindPrintCenterEvent(map, source, params, fixing)
  })

  return {
    unBindEvent() {
      $el.off('click')
    },
    bindIndexEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        let { longitude, latitude } = item.latest_location, iconPath, marker
        fixing.fixingId = item.entity_name
        fixing.point = new BMap.Point(longitude, latitude)
        fixing.isTrigger = true
          
        if (item.entity_desc === '在线') iconPath = '/assets/porint_online.png'
        if (item.entity_desc === '离线') iconPath = '/assets/porint_offline.png'
        marker = new BMap.Marker(fixing.point , { icon: new BMap.Icon(iconPath, new BMap.Size(31, 44)) })
        map.addOverlay(marker)
        Event.create('map').trigger('mapPanToMarkerPoint', map, fixing.point)
        Event.create('map').trigger('initMarkerInfoWindow', map, source, params, fixing, marker)
      })

    },
    bindControlEvent(map, source, params, fixing) {
      $el.on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        if (!window.isClickLock) {
          window.isClickLock = true
          if (window.setIntervaler) {
            
            fixing.type = 'init'
            clearInterval(window.setIntervaler)
          }
          fixing.point = new BMap.Point(item.latest_location.longitude, item.latest_location.latitude)
          fixing.fixingId = item.entity_name
          fixing.isTrigger = true

          Event.create('map').trigger('mapPanToMarkerPoint', map, fixing.point)
          Event.create('fixing').trigger('GetLastPosition', map, item, params, fixing)
          window.setIntervaler = setInterval(() => {
            fixing.type = 'update'
            fixing.isTrigger = true
            Event.create('fixing').trigger('GetLastPosition', map, item, params, fixing)
          }, 60000)
        }
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
    bindSMSEvent(map, source, params, fixing) {
      $el.off('click').on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')

        Event.create('fixing').trigger('smsInstructionsDialog', map, item, params, fixing)
      })
    },
    bindPrintCenterEvent(map, source, params, fixing) {
      $el.off('click').on('click', 'li', function (e) {
        let item = $(e.currentTarget).data()
        // update item css
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')
        Event.create('fixing').trigger('GetFixingQRCode', map, item, params, fixing)
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
        if (params && params.fixingId === item.entity_name) {
          activeTextColor = 'text-white'
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
  Event.create('fixing').listen('GetFixingInfo', function (map) {
    fixingInfo.refresh(map)
  })

  return {
    refresh(map) {
      let titleHHTML = map.getInfoWindow().getTitle(),
        titleNode = document.createRange().createContextualFragment(titleHHTML),
        fixingId = titleNode.textContent,
        // loacl 获取数据
        userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetFixingInfo({ adminId: userInfo.AdminId, fixingId }).then(res => {
        if (res.data.ret === 1001) {
          let { bindingList, fixinginfo } = res.data, bindingListContent,
            activatedTime = utils.handleTimestampToDate(fixinginfo.activatedTime),
            batchId = fixinginfo.batchId,
            bindingNum = fixinginfo.bindingNum,
            btSwitch = fixinginfo.btSwitch,
            createTime = utils.handleTimestampToDate(fixinginfo.createTime),
            emergencyContact = fixinginfo.emergencyContact,
            expireTime = utils.handleTimestampToDate(fixinginfo.expireTime),
            fixingPassword = fixinginfo.fixingPassword,
            isStarting = fixinginfo.isStarting === '1' ? '开机' : '关机',
            managerId = fixinginfo.managerId,
            mode = fixinginfo.mode === '0' ? '省电模式' : fixinginfo.mode === '1' ? '正常模式' : '追踪模式',
            // mode = fixinginfo.mode === '1' ? '正常模式' : '追踪模式',
            serivceId = fixinginfo.serivceId,
            sms = fixinginfo.sms,
            state = fixinginfo.state

          $el.find('.fixingid').text(fixingId)
          $el.find('.mode').text(isStarting)
          $el.find('.batchId').text(batchId)
          $el.find('.emergencyContact').text(emergencyContact)
          $el.find('.createTime').text(createTime)
          $el.find('.expireTime').text(expireTime)
          $el.find('.activatedTime').text(activatedTime)
          $el.find('.sms').text(sms)

          if (bindingList) {
            bindingListContent = `
              <table class="p table table-borderless">
                <thead class="p-2 normal">
                  <tr>
                    <th scope="col" class="normal text-muted p-1">头像</th>
                    <th scope="col" class="normal text-muted p-1">昵称</th>
                    <th scope="col" class="normal text-muted p-1">电话</th>
                    <th scope="col" class="normal text-muted p-1">鞋垫昵称</th>
                    <th scope="col" class="normal text-muted p-1">绑定时间</th>
                    <th scope="col" class="normal text-muted p-1">审核</th>
                  </tr>
                </thead>
                <tbody>
                ${bindingList.map(item => {
                return `<tr class="pointer">
                    <th scope="row" class="p-1 text-center"><img src="${item.UserIcon}" widht="16" height="16" />  </th>
                    <td class="p p-1 text-white-50">${item.relation}</td>
                    <td class="p p-1 text-white-50">${item.Phone}</td>
                    <td class="p p-1 text-white-50">${item.fixingName}</td>
                    <td class="p p-1 text-white-50">${item.createTime}</td>
                    <td class="p p-1 text-white-50">${item.state}</td>
                  </tr>`
              }).join('')
              }
                </tbody>
              </table>`
          } else {
            bindingListContent = '<h5 class="d-flex align-items-center">该设备未绑定</h5>'
          }

          $el.find('.bindingList').html(bindingListContent)
          $el.modal('show')

        }

      })
    }
  }
})($('#fixing-info-ModalCenter'))


// instructions-list-20181126-ModalCenter
var instructionsDialog = (function ($el) {
  Event.create('fixing').listen('instructionsDialog', function (map, fixing) {
    instructionsDialog.refresh(map, fixing)
  })

  return {
    refresh(map, fixing) {
      Event.create('fixing').trigger('AdminGetInstructionsList', map, fixing)
      Event.create('fixing').trigger('AdminGetInstructions', map, fixing)
    }
  }
})()

var AdminGetInstructions = (function($el) {
  Event.create('fixing').listen('AdminGetInstructions', function (map, fixing) {
    AdminGetInstructions.refresh(map, fixing)
  })
  
  return {
    refresh(map, fixing) {
      let titleHHTML = map.getInfoWindow().getTitle(),
        titleNode = document.createRange().createContextualFragment(titleHHTML)
      fixing.fixingId = titleNode.textContent
      if (fixing.type === 'init') {
        let currentTime = $el.find('.instructions-datepicker').attr('value')
        console.log(currentTime)
        if (currentTime) fixing.currentTime = currentTime
      }
      console.log(fixing)
      // loacl 获取数据
      $el.find('.instructions-datepicker').datepicker('update', fixing.currentTime)
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.AdminGetInstructions({ adminId: userInfo.AdminId, fixingId: fixing.fixingId, time: fixing.currentTime }).then(res => {
        if (res.data.ret === 1001) {
          // 1 设备 2 平台
          let instructionsContent = res.data.data.reverse().map(item => {
            let leixingText = item.leixing === '1' ? '设备' : '平台'
            return $(`<tr class="">
                <td class="" width="120">${item.shijian}</td>
                <td class="" width="100">${leixingText}</td>
                <td class="breakAll">${item.content}</td>
              </tr>`)
          })
          $el.find('#AdminGetInstructions .tbody').mCustomScrollbar()
          .find('.mCustomScrollBox > .mCSB_container').empty().append(instructionsContent)
          $el.find('#AdminGetInstructions .tbody').mCustomScrollbar('scrollTo', 'top')
          $el.modal('show')
        }
        if (res.data.ret === 1002) {
          $el.find('#AdminGetInstructions  .tbody').mCustomScrollbar()
          .find('.mCustomScrollBox > .mCSB_container').empty().append(`<tr>
            <td colspan="3" class="text-center pt-2 pb-2">${res.data.code}</td>
          </tr>`)
          $el.modal('show')
        }
      })
    }
  }

})($('#instructions-list-20181126-ModalCenter'))


var AdminGetInstructionsList = (function($el) {
  Event.create('fixing').listen('AdminGetInstructionsList', function (map, fixing) {
    AdminGetInstructionsList.refresh(map, fixing)
  })
  
  return {
    refresh(map, fixing) {
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.AdminGetInstructionsList({ adminId: userInfo.AdminId }).then(res => {
        if (res.data.ret === 1001) {
          let instructionsContent = res.data.data.map((item, index) => {
            return $(`<tr class="" data-id="${item.Id}" data-instructions="${item.Instructions}" data-type="${item.type}">
                <td class="pl-4">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios${item.Id}" value="${item.Instructions}">
                  <label class="form-check-label" for="exampleRadios${item.Id}">
                    ${item.Content}
                  </label>
                </div>
              </td>
              </tr>`)
          })
          $el.find('#AdminGetInstructionsList .tbody').mCustomScrollbar()
          .find('.mCustomScrollBox > .mCSB_container').empty().append(instructionsContent)
        }
        if (res.data.ret === 1002) {
        
        }
      })
    }
  }

})($('#instructions-list-20181126-ModalCenter'))

// 鞋垫指令
// var fixingInstructions = (function ($el) {
//   Event.create('fixing').listen('AdminGetInstructionsList', function (map, fixing) {
//     fixingInstructions.refresh(map, fixing)
//   })

//   return {
//     refresh(map, fixing) {
//       let titleHHTML = map.getInfoWindow().getTitle(),
//         titleNode = document.createRange().createContextualFragment(titleHHTML)
//       fixing.fixingId = titleNode.textContent
//       if (fixing.type === 'init') {
//         let currentTime = $el.find('.instructions-datepicker').attr('value')
//         console.log(currentTime)
//         if (currentTime) fixing.currentTime = currentTime
//       }
//       console.log(fixing)
//       // loacl 获取数据
//       $el.find('.instructions-datepicker').datepicker('update', fixing.currentTime)
//       let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
//       FIXING_API.AdminGetInstructions({ adminId: userInfo.AdminId, fixingId: fixing.fixingId, time: fixing.currentTime }).then(res => {
//         if (res.data.ret === 1001) {
//           let instructionsContent = res.data.data.reverse().map(item => {
//             return $(`<tr class="">
//                 <td class="border">${item.shijian}</td>
//                 <td class="border text-center">${item.leixing}</td>
//                 <td class="border breakAll">${item.content}</td>
//               </tr>`)
//           })
//           $el.find('.instructions-table > tbody').empty().append(instructionsContent)
//           $el.modal('show')
//         }
//         if (res.data.ret === 1002) {
//           $el.find('.instructions-table > tbody').empty().append(`<tr>
//             <td colspan="3" class="border text-center pt-2 pb-2">${res.data.code}</td>
//           </tr>`)
//           $el.modal('show')
//         }
//       })
//     }
//   }
// })($('#instructions-list-ModalCenter'))


// 指令日期选择器
var fixingInstructionsDatepicker = (function ($el) {
  Event.create('fixing').listen('instructionsDialog', function (map, fixing) {
    fixingInstructionsDatepicker.refresh(map, fixing)
  })

  return {
    refresh(map, fixing) {
      $el.off('changeDate').on('changeDate', function (e) {
        fixing.currentTime = utils.handleTimestampToDate($el.datepicker('getDate'))
        $el.datepicker('update', fixing.currentTime)
        fixing.type = 'update'
        Event.create('fixing').trigger('AdminGetInstructions', map, fixing)
      })
    }
  }
})($('.instructions-datepicker'))

// 
var SendInstruction = (function ($el) {
  Event.create('fixing').listen('instructionsDialog', function (map, fixing) {
    SendInstruction.refresh(map, fixing)
  })

  return {
    refresh(map, fixing) {
      $el.off('click').on('click', function (e) {
        let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
        let instruction = $('#InstructionsTextarea').val()
        // let InstructionsRadio = $('input:radio:checked').val()
        // let instruction = InstructionsTextarea ? InstructionsTextarea : InstructionsRadio
        FIXING_API.SendInstruction({ adminId: userInfo.AdminId, fixingId: fixing.fixingId, instruction }).then(res => {
          if (res.data.ret === 1001 ) {
            $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
            $('#no-data-ModalCenter').modal('show')
            Event.create('fixing').trigger('AdminGetInstructions', map, fixing)
          }
          if (res.data.ret === 1002) {
            $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
            $('#no-data-ModalCenter').modal('show')
          }
        })
      })
    }
  }
})($('#SendInstruction-button'))

var AdminGetInstructionsListChecks = (function ($el) {
  Event.create('fixing').listen('instructionsDialog', function (map, fixing) {
    AdminGetInstructionsListChecks.refresh(map, fixing)
  })

  return {
    refresh(map, fixing) {
      $el.off('click').on('click', 'input.form-check-input', function (e) {
        $('#InstructionsTextarea').val($(this).val())
      })
    }
  }
})($('#AdminGetInstructionsList'))

// qrcode dialog
var fixingqrcodedialog = (function ($el) {
  Event.create('fixing').listen('fixingqrcodedialog', function (map) {
    fixingqrcodedialog.refresh(map)
  })

  return {
    refresh(map) {
      let titleHHTML = map.getInfoWindow().getTitle(),
      titleNode = document.createRange().createContextualFragment(titleHHTML),
      fixingId = titleNode.textContent,
      // loacl 获取数据
      userInfo = utils.GetLoaclStorageUserInfo('userinfo')
    FIXING_API.GetFixingQRCode({ adminId: userInfo.AdminId, fixingId }).then(res => {
      if (res.data.ret == 1001) {
        // $el.find('#qrcode-big').qrcode({
        //   width: 158,
        //   height: 158,
        //   text: res.data.data, //二维码的内容
        //   // moduleSize: '20px',
        //   ECLevel: 3
        // });
        // var qrcodeSmallSrc =  $el.find("#qrcode-big canvas")[0].toDataURL();//二维码canvas转img
        // $el.find("#qrcode-big img").attr("src", qrcodeSmallSrc);
        $el.find("#qrcode-big img").attr("src", `https://dataconsole.abpao.com/Login/getContactsMP?url=${res.data.data}`);
        // $el.find("#qrcode-big canvas").hide();//隐藏canvas部分
        $el.find('#qrcode-big p').text(fixingId)
        $el.find('.print-qrcode-button').off('click').on('click', function () {
          // $("#qrcode-big").jqprint({
          //   debug: true, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false 
          //   importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件） 
          //   printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。 
          //   // operaSupport: true //表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true 
          // })
          let strWindowFeatures = `
                channelmode=no,
                directories=no,
                fullscreen=no,
                menubar=no,
                resizable=no,
                scrollbars=no,
                titlebar=no,
                toolbar=no,
                status=no,
                location=no,
                height=268,
                width=318,
                left=50
            `;
          let windowObjectReference = window.open(`/print.html?url=${res.data.data}&fixingId=${fixingId}`, "_blank", strWindowFeatures)
          //  $('#qrcode-big').printThis({
          //     debug: true,               // show the iframe for debugging
          //     importCSS: true,            // import parent page css
          //     importStyle: false,         // import style tags
          //     printContainer: true,       // print outer container/$.selector
          //     loadCSS: '/styles/print.css',                // path to additional css file - use an array [] for multiple
          //     // pageTitle: "",              // add title to print page
          //     removeInline: false,        // remove inline styles from print elements
          //     removeInlineSelector: "*",  // custom selectors to filter inline styles. removeInline must be true
          //     printDelay: 333,            // variable print delay
          //     header: null,               // prefix to html
          //     // footer: null,               // postfix to html
          //     // footer: $el.find('#qrcode-big p'),
          //     base: false,                // preserve the BASE tag or accept a string for the URL
          //     formValues: true,           // preserve input/form values
          //     canvas: false,              // copy canvas content
          //     // doctypeString: '...',       // enter a different doctype for older markup
          //     removeScripts: false,       // remove script tags from print content
          //     copyTagClasses: false,      // copy classes from the html & body tag
          //     beforePrintEvent: null,     // function for printEvent in iframe
          //     beforePrint: null,          // function called before iframe is filled
          //     afterPrint: null            // function called before iframe is removed
          //   })
        })
        $el.modal('show')
       
      }
      if (res.data.ret === 1002) {
        $el.find('#qrcBody > p').text(res.data.code)
        $el.find('.print-qrcode-button').hide()
        $el.modal('show')
      }
      
      })
    }
  }
})($('#fixing-qrcod-ModalCenter'))

var fixingQRCode = (function ($el) {
  Event.create('fixing').listen('GetFixingQRCode', function (map, item, params, fixing) {
    fixingQRCode.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      // loacl 获取数据
      userInfo = utils.GetLoaclStorageUserInfo('userinfo')
    FIXING_API.GetFixingQRCode({ adminId: userInfo.AdminId, fixingId: item.entity_name }).then(res => {
      if (res.data.ret == 1001) {
        let strWindowFeatures = `
        channelmode=no,
        directories=no,
        fullscreen=no,
        menubar=no,
        resizable=no,
        scrollbars=no,
        titlebar=no,
        toolbar=no,
        status=no,
        location=no,
        height=268,
        width=318,
        left=50
        `;
        let windowObjectReference = window.open(`/print.html?url=${res.data.data}&fixingId=${item.entity_name}`, "_blank", strWindowFeatures)
      }
      if (res.data.ret === 1002) {
        $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
        $('#no-data-ModalCenter').modal('show')
      }
    })
  }
  }
})()

// input 
var inputTXM = (function ($el) {
  Event.create('fixing').listen('print-center', function (map, item, params, fixing) {
    inputTXM.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      $(function () {
        $el.find('#txm').val('')
        $el.find('#tmx').focus()
        let isLock = false
        $el.find('button[type=submit]').off('click').on('click', function (e) {
          e.preventDefault()
          let fixingId = $el.find('#txm').val()
          let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
          if (isLock) return
          isLock = true
          FIXING_API.GetFixingQRCode({ adminId: userInfo.AdminId, fixingId }).then(res => {
            if (res.data.ret == 1001) {
              let windowObjectReference = window.open(`/print.html?url=${res.data.data}&fixingId=${fixingId}`, "_blank", `
              channelmode=no,
              directories=no,
              fullscreen=no,
              menubar=no,
              resizable=no,
              scrollbars=no,
              titlebar=no,
              toolbar=no,
              status=no,
              location=no,
              height=268,
              width=318,
              left=50
              `)
              $el.find('#txm').val('')
            }
            if (res.data.ret === 1002) {
              $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
              $('#no-data-ModalCenter').modal('show')
              $el.find('#txm').val('')
            }
            isLock = false
          })
       })
      })
    }
  }
})($('.txm-container'))

// // 打印二维码
// var printQRCode = (function ($el) {
//   Event.create('fixing').listen('printQRCode', function (map, item, params, fixing) {
//     printQRCode.refresh(map, item, params, fixing)
//   })

//   return {
//     refresh(url) {
     
//     }
//   }
// })()

// 鞋垫信息实时
var fixingInfoLive = (function ($el) {
  var oldCreateTime
  Event.create('fixing').listen('GetLastPosition', function (map, item, params, fixing) {
    fixingInfoLive.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      if (fixing.type === 'init') {
        $el.find('.live-info-tbody').empty()
        oldCreateTime = null
      }

      // loacl 获取数据
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      // 请求最后位置信息接口
      FIXING_API.GetLastPosition({ adminId: userInfo.AdminId, fixingId: item.entity_name }).then(res => {
        
        window.isClickLock = false
        let marker
        if (res.data.ret === 1001) {
          let address = res.data.address,
            charge = res.data.charge === '1' ? '充电中' : '未充电',
            createTime = utils.handleTimestampToDateTime(res.data.createTime),
            electricity = res.data.electricity, // 电量
            mode = res.data.mode,
            modestatus = res.data.modestatus === '0' ? '省电模式' : res.data.modestatus === '1' ? '正常模式' : '追踪模式',
            positions = res.data.positions.split(','),
            lng = positions[0],
            lat = positions[1],
            shutdown = res.data.shutdown === '0' ? '关机' : '开机',
            status = res.data.status === '1' ? '运动' : '静止',
            iconPath

          if (oldCreateTime !== res.data.createTime) {
            map.clearOverlays()
            oldCreateTime = res.data.createTime
            if (item.entity_desc === '在线') iconPath = '/assets/porint_online.png'
            if (item.entity_desc === '离线') iconPath = '/assets/porint_offline.png'
            fixing.point = new BMap.Point(lng, lat)
            marker = new BMap.Marker(fixing.point, { icon: new BMap.Icon(iconPath, new BMap.Size(31, 44)) })
            map.addOverlay(marker)

            $el
              .find('.live-info-tbody')
              .append(`
                <tr id="${res.data.createTime}">
                <th scope="row" class="normal pt-4 pb-4 text-center" width="5%">${shutdown}</th>
                <td class="normal pt-4 pb-4 text-center" width="5%">${mode}</td>
                <td class="normal pt-4 pb-4 text-center" width="10%">${item.entity_name}</td>
                <td class="normal pt-4 pb-4 text-center" width="10%">${createTime}</td>
                <td class="normal pt-4 pb-4 text-center" width="5%">${charge}</td>
                <td class="normal pt-4 pb-4 text-center" width="5%">${electricity}%</td>
                <td class="normal pt-4 pb-4 text-center" width="5%">${modestatus}</td>
                <td class="normal pt-4 pb-4 text-center" width="5%">${status}</td>
                <td class="normal pt-4 pb-4 text-center" width="25%">${lng}, ${lat}</td>
                <td class="normal pt-4 pb-4 text-center" width="25%">${address}</td>
                        </tr>
                `)
              .off('mouseenter mouseleave')
              .on('mouseenter mouseleave', 'tr', function (e) {
                $(e.currentTarget).addClass('active').siblings().removeClass('active')
              })
            $el.mCustomScrollbar()
            utils.setUrlToTableIndex(res.data.createTime)

            Event.create('map').trigger('controlMarkerInfoWindow', map, res.data, params, fixing, marker)
          }

        }
        if (res.data.ret === 1003) {
          fixing.point = new BMap.Point(0, 0)
          marker = new BMap.Marker(fixing.point, { icon: new BMap.Icon('/assets/porint_offline.png', new BMap.Size(31, 44)) })
          map.addOverlay(marker)

          Event.create('map').trigger('controlMarkerInfoWindow', map, res.data, params, fixing, marker)
          // map.clearOverlays()
          // $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
          // $('#no-data-ModalCenter').modal('show')
        }
      })
    }
  }
})($('.live-info-container'))



var fixingTrajectoryTable = (function ($el) {
  Event.create('fixing').listen('fixingTrajectoryTable', function (map, source, params, fixing) {
    fixingTrajectoryTable.refresh(map, source, params, fixing)
  })
  return {
    refresh(map, source, params, fixing) {
      $el.find('.track-list-tbody').mCustomScrollbar()
      .find('.mCustomScrollBox > .mCSB_container')
        .empty()
        .append(source.map((item, index) => {
          let address = item.address,
            charge = item.charge === '1' ? '充电中' : '未充电',
            createTime = item.create_time,
            electricity = `${item.electricity}% `, // 电量
            longitude = item.longitude,
            latitude = item.latitude,
            mode = item.mode,
            modestatus = item.modestatus === '0' ? '省电模式' : item.modestatus === '1' ? '正常模式' : '追踪模式',
            // modestatus = item.modestatus === '1' ? '正常模式' : '追踪模式',
            shutdown = item.shutdown === '0' ? '关机' : '开机',
            status = item.status === '1' ? '运动' : '静止'


          let renderTableRow = () => {
            return $(`
          <tr id='${index}'>
          <th scope="row" class="normal pt-4 pb-4 text-center" width="5%">${shutdown}</th>
          <td class="normal pt-4 pb-4 text-center" width="5%">${mode}</td>
          <td class="normal pt-4 pb-4 text-center" width="10%">${fixing.fixingId}</td>
          <td class="normal pt-4 pb-4 text-center" width="10%">${createTime}</td>
          <td class="normal pt-4 pb-4 text-center" width="5%">${charge}</td>
          <td class="normal pt-4 pb-4 text-center" width="5%">${electricity}</td>
          <td class="normal pt-4 pb-4 text-center" width="5%">${modestatus}</td>
          <td class="normal pt-4 pb-4 text-center" width="5%">${status}</td>
          <td class="normal pt-4 pb-4 text-center" width="25%">${longitude}, ${latitude}</td>
          <td class="normal pt-4 pb-4 text-center" width="25%">${address}</td>
          </tr>
          `)
              .off('click')
              .on('click', function (e) {
                $(this).addClass('active').siblings().removeClass('active')
                fixing.currentTime = utils.handleTimestampToDate($('.trajectory-datepicker').datepicker('getDate'))
                $('.instructions-datepicker').attr('value', fixing.currentTime)
                $('.instructions-datepicker').datepicker('update')
                // $('.instructions-datepicker').attr('value', $('.instructions-datepicker').attr('value'))
                // utils.setUrlToTableIndex(item.markerIndex)
                // fixing.fixingId = item.entity_name
                Event.create('map').trigger('trajectoryMarkerInfoWindow', map, item, params, fixing)
              })
          }
          if (fixing.modegps && mode === 'GPS') {
            return renderTableRow()
          }
          if (fixing.modelbs && mode === 'LBS') {
            return renderTableRow()
          }
          if (fixing.modewifi && mode === 'WIFI') {
            return renderTableRow()
          }
        }))
        $el.find('.track-list-tbody').mCustomScrollbar('scrollTo', 'top')
    }
  }
})($('.track-info-container'))

// 轨迹信息
var fixingTrajectory = (function ($el) {
  Event.create('fixing').listen('GetTrackList', function (map, item, params, fixing) {
    fixingTrajectory.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      if (fixing.type === 'init') {
        $('.trajectory-datepicker').datepicker('update', fixing.currentTime);
      }
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetTrackList({ adminId: userInfo.AdminId, fixingId: item.entity_name, time: fixing.currentTime }).then(res => {
        if (res.data.ret === 1001) {
          fixing.fixingId = item.entity_name

          fixing.modegps = $('.mode-container').find("#modegps").prop('checked')
          fixing.modelbs = $('.mode-container').find("#modelbs").prop('checked')
          fixing.modewifi = $('.mode-container').find("#modewifi").prop('checked')
          Event.create('fixing').trigger('fixingTrajectoryTable', map, res.data.data, params, fixing)
          Event.create('map').trigger('GetTrackList', map, res.data.data, params, fixing)
        }
        if (res.data.ret === 1002) {
          map.clearOverlays()
          $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
          $('#no-data-ModalCenter').modal('show')
        }
      })
    }
  }
})()


var fixingTrajectoryDatepicker = (function ($el) {
  Event.create('fixing').listen('GetTrackList', function (map, item, params, fixing) {
    fixingTrajectoryDatepicker.refresh(map, item, params, fixing)
  })
  return {
    refresh(map, item, params, fixing) {
      $el.off('changeDate').on('changeDate', function (e) {
        fixing.currentTime = utils.handleTimestampToDate($el.datepicker('getDate'))
        $el.datepicker('update')
        $('.instructions-datepicker').attr('value', fixing.currentTime)
        Event.create('fixing').trigger('GetTrackList', map, item, params, fixing)
      })
    }
  }
})($('.trajectory-datepicker'))

var sportData = (function ($el) {
  let
    stepsOption = {
      title: {
        top: 5,
        left: 'center',
        text: '计步数据（单位：步）',
        subtext: 'steps'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
        // position: function (pos, params, el, elRect, size) {
        //   console.log(arguments)
        //   var obj = { top: 10 };
        //   obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        //   return obj;
        // },
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
        text: '卡路里数据（单位：卡路里）',
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
        text: '体重数据（单位：千克）',
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
        text: '距离数据（单位：米）',
        subtext: 'distance'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        // 使用字符串模板，模板变量为图例名称 {name}
        // formatter: 'Legend {a0}',
        // 使用回调函数
        formatter: function (name) {
            return `${name[0].axisValue}<br /> ${Number.parseInt(name[0].value)} 米`
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
        let xAxisArrays = [], stepsArrays = [], caloriesArrays = [], weightArrays = [], distanceArrays = []
        if (res.data.ret === 1001) {

          res.data.sportList.forEach(item => {
            let xAxis = `${utils.handleToYYYYMMDD(new Date(Number.parseInt(item.createTime + '000'))).DD} 日`
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

          [0, 0, 0, 0, 0, 0, 0].forEach(item => {
            let xAxis = `${utils.handleToYYYYMMDD(new Date()).DD} 日`
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
          // update
          fixing.steps.setOption(stepsOption)
          fixing.calorie.setOption(caloriesOption)
          fixing.weight.setOption(weightOption)
          fixing.distance.setOption(distanceOption)
          $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
          $('#no-data-ModalCenter').modal('show')
        }
      })
    },
    initFixingSportData(map, source, params, fixing) {
      let xAxisArrays = [], stepsArrays = [], caloriesArrays = [], weightArrays = [], distanceArrays = [];


      [0, 0, 0, 0, 0, 0, 0].forEach(item => {
        let xAxis = `${utils.handleToYYYYMMDD(new Date()).DD} 日`
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
        $el.datepicker('update')
        fixing.type = 'update'
        Event.create('fixing').trigger('GetFixingSportData', map, item, params, fixing)
      })
    }
  }
})($('.sportdata-datepicker'))

// 发送短信指令
// var fixingPushSmsInstructions = (function ($el) {
//   Event.create('fixing').listen('GetSmsInstructionsList', function (map, item, params, fixing) {
//     fixingPushSmsInstructions.refresh(map, item, params, fixing)
//   })
//   Event.create('fixing').listen('sms', function (map, source, params, fixing) {
//     fixingPushSmsInstructions.smsRefresh(map, source, params, fixing)
//   })
//   return {
//     smsRefresh(map, source, params, fixing ) {
//       $el.off('click').on('click', function () {
//         $('#no-data-ModalCenter').find('.no-data-container').text('请先在列表中选择设备ID')
//         $('#no-data-ModalCenter').modal('show')
//       })
//     },
//     refresh(map, item, params, fixing) {
//       $el.off('click').on('click', function () {
//         if (fixing.type === 'init') {
//           $('.sms-datepicker').datepicker('update');
//         }
//         let userInfo = utils.GetLoaclStorageUserInfo('userinfo'),
//           content = $('#sms-instructions-list-textarea').val()
//         if (!content) {
//           $('#no-data-ModalCenter').find('.no-data-container').text('请输入发送指令')
//           $('#no-data-ModalCenter').modal('show')
//           return
//         }
//         FIXING_API.PushSmsInstructions({ adminId: userInfo.AdminId, fixingId: item.entity_name, content }).then(res => {
//           if (res.data.ret === 1001) {
//             fixing.type = 'push'
//             Event.create('fixing').trigger('GetSmsInstructionsList', map, item, params, fixing)
//           }
//           if (res.data.ret === 1002) {
//             $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
//             $('#no-data-ModalCenter').modal('show')
//           }
//         })
//       })

//     }
//   }
// })($('.push-sms-instructions'))

var smsDatepicker = (function ($el) {
  Event.create('fixing').listen('smsInstructionsDialog', function (map, item, params, fixing) {
    smsDatepicker.refresh(map, item, params, fixing)
  })
  return {
    refresh(map, item, params, fixing) {
      $el.datepicker('update', fixing.currentTime)
      $el.off('changeDate').on('changeDate', function (e) {
        fixing.currentTime = utils.handleTimestampToDate($el.datepicker('getDate'))
        $el.datepicker('update', fixing.currentTime)
        fixing.type = 'update'
        Event.create('fixing').trigger('GetSmsInstructionsList', map, item, params, fixing)
      })
    }
  }
})($('.sms-datepicker'))


// sms-instructions-list-20181207-ModalCenter
var smsInstructionsDialog = (function ($el) {
  Event.create('fixing').listen('smsInstructionsDialog', function (map, item, params, fixing) {
    smsInstructionsDialog.refresh(map, item, params, fixing)
  })
  return {
    refresh(map, item, params, fixing) {
      Event.create('fixing').trigger('GetSmsInstructionsList', map, item, params, fixing)
      Event.create('fixing').trigger('GetSmsInstructionsMod', map, item, params, fixing)
    }
  }
})()

// sms-restart-button 
var smsRestartButton= (function ($el) {
  Event.create('fixing').listen('smsInstructionsDialog', function (map, item, params, fixing) {
    smsRestartButton.refresh(map, item, params, fixing)
  })
  return {
    refresh(map, item, params, fixing) {
      $el.off('click').on('click', function () {
        Event.create('fixing').trigger('GetSmsInstructionsList', map, item, params, fixing)
      })
    }
  }
})($('.reset-button'))

// 发送指令短信
var PushSmsInstructions = (function ($el) {
  Event.create('fixing').listen('smsInstructionsDialog', function (map, item, params, fixing) {
    PushSmsInstructions.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      $el.off('click').on('click', function (e) {
        let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
        let content = $('#InstructionsTextarea').val()
        // let InstructionsRadio = $('input:radio:checked').val()
        // let instruction = InstructionsTextarea ? InstructionsTextarea : InstructionsRadio
        FIXING_API.PushSmsInstructions({ adminId: userInfo.AdminId, fixingId: item.entity_name, content }).then(res => {
          if (res.data.ret === 1001 ) {
            $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
            $('#no-data-ModalCenter').modal('show')
            Event.create('fixing').trigger('AdminGetInstructions', map, item, params, fixing)
          }
          if (res.data.ret === 1002) {
            $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
            $('#no-data-ModalCenter').modal('show')
          }
        })
      })
    }
  }
})($('#sms-push-button'))

var AdminGetInstructionsListChecks = (function ($el) {
  Event.create('fixing').listen('smsInstructionsDialog', function (map, item, params, fixing) {
    AdminGetInstructionsListChecks.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      $('#InstructionsTextarea').val('')
      $el.off('click').on('click', 'input.form-check-input', function (e) {
        $('#InstructionsTextarea').val($(this).val())
      })
    }
  }
})($('#GetSmsInstructionsMod'))

// 短信列表
var GetSmsInstructionsList = (function ($el) {
  Event.create('fixing').listen('GetSmsInstructionsList', function (map, item, params, fixing) {
    GetSmsInstructionsList.refresh(map, item, params, fixing)
  })

  return {
    refresh(map, item, params, fixing) {
      if (fixing.type === 'init') {
        let currentTime = $el.find('.instructions-datepicker').attr('value')
        // console.log(currentTime)
        if (currentTime) fixing.currentTime = currentTime
        // console.log(fixing)
      }
      // fixing.fixingId = item.entity_name
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetSmsInstructionsList({ adminId: userInfo.AdminId, fixingId: item.entity_name, time: fixing.currentTime }).then(res => {
        if (res.data.ret === 1001) {
          let smsInstructionsContent = res.data.data.map((item, index) => {
                let Content = item.Content,
                Ctime = utils.handleTimestampToDateTime(item.Ctime),
                Fcontent = item.Fcontent,
                Ftime = item.Ftime,
                Id = item.Id,
                Imei = item.Imei,
                Mobile = item.Mobile,
                Sendkey = item.Sendkey,
                status = item.status === '0' ? '发送失败' : '发送成功'
              return $(`
                  <tr id='${index}'>
                  <th scope="row" class="normal border pt-2 pb-2 text-center" width="20%">${Ctime}</th>
                  <td class="normal border pt-2 pb-2 text-center" width="10%">${Sendkey}</td>
                  <td class="normal border pt-2 pb-2 text-center" width="10%">${status}</td>
                  <td class="normal border pt-2 pb-2 text-center" width="30%">${Content}</td>
                  <td class="normal border pt-2 pb-2 text-center" width="15%">${Imei}</td>
                  <td class="normal border pt-2 pb-2 text-center" width="15%">${Mobile}</td>
                  </tr>
                  `)
            })
            $el.find('#GetSmsInstructionsList .tbody').mCustomScrollbar()
            .find('.mCustomScrollBox > .mCSB_container').empty().append(smsInstructionsContent)
            $el.find('#AdminGetInstructions .tbody').mCustomScrollbar('scrollTo', 'top')
            $el.modal('show')
        }
        if (res.data.ret === 1002) {
          $el.find('#GetSmsInstructionsList .tbody').mCustomScrollbar()
          .find('.mCustomScrollBox > .mCSB_container').empty().append(`<tr>
            <td colspan="6" class="text-center pt-2 pb-2">${res.data.code}</td>
          </tr>`)
          $el.modal('show')
        }
      })
    }
  }
})($('#sms-instructions-list-20181207-ModalCenter'))


// 短信指令
var GetSmsInstructionsMod = (function($el) {
  Event.create('fixing').listen('GetSmsInstructionsMod', function (map, item, params, fixing) {
    GetSmsInstructionsMod.refresh(map, item, params, fixing)
  })
  
  return {
    refresh(map, item, params, fixing) {
      let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetSmsInstructionsMod({ adminId: userInfo.AdminId }).then(res => {
        if (res.data.ret === 1001) {
          console.log(res)
          let smsInstructionsContent = res.data.data.map((item, index) => {
            return $(`<tr class="" data-id="${item.Id}" data-instructions="${item.Instructions}" data-type="${item.type}">
                <td class="pl-4">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios${item.Id}" value="${item.Instructions}">
                  <label class="form-check-label" for="exampleRadios${item.Id}">
                    ${item.Content}
                  </label>
                </div>
              </td>
              </tr>`)
          })
          $el.find('#GetSmsInstructionsMod .tbody').mCustomScrollbar()
          .find('.mCustomScrollBox > .mCSB_container').empty().append(smsInstructionsContent)
        }
        if (res.data.ret === 1002) {
        
        }
      })
    }
  }

})($('#sms-instructions-list-20181207-ModalCenter'))