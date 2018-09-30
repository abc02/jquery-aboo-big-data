// 鞋垫地图计数模块
var fixingMarkerCount = (function ($el) {
  Event.create('fixing').listen('GetFixingList', function (map) {
    fixingMarkerCount.refresh(map)
  })

  return {
    refresh(map) {
      $el.text(map.getOverlays().length)
    }
  }
})($('.visible-marker'))
// // 鞋垫搜索模块
// var fixingSearch = (function ($el) {
//   Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
//     fixingSearch.refresh(map, source, fixing)
//   })
//   return {
//     refresh(map, source, fixing) {
//       const KEY = 'entity_desc'
//       let pageName = utils.GetUrlPageName(),
//         pageSize = utils.GetFixingListsPaginationPageSize(pageName),
//         allArrays = Object.assign([], source),
//         onlineArrays = utils.FilterFixingLists(source, KEY, '在线'),
//         offlineArrays = utils.FilterFixingLists(source, KEY, '离线'),
//         cache = null
//       $el.off('input').on('input', function (e) {
//         const KEY = 'entity_name',
//           VALUE = $(e.currentTarget).val()
//         let { fixingListsTabIndex } = utils.GetUrlParams()
//         if (!fixingListsTabIndex) {
//           fixingListsTabIndex = 0
//         }
//         switch (fixingListsTabIndex) {
//           case '0':
//             cache = utils.FilterFixingListsSearch(allArrays, KEY, VALUE)
//             break;
//           case '1':
//             cache = utils.FilterFixingListsSearch(onlineArrays, KEY, VALUE)
//             break;
//           case '2':
//             cache = utils.FilterFixingListsSearch(offlineArrays, KEY, VALUE)
//             break;
//         }
//         Event.create('fixing').trigger('GetFixingList', cache, { ...fixing, pageSize })
//       })
//     }
//   }
// })($('.nav-search'))

// 鞋垫列表Tab模块 
var fixingListsTab = (function ($el) {
  Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
    fixingListsTab.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      let cache = null,
        allArrays = Object.assign([], source),
        onlineArrays = utils.FilterFixingLists(source, 'entity_desc', '在线'),
        offlineArrays = utils.FilterFixingLists(source, 'entity_desc', '离线'),
        pageName = utils.GetUrlPageName(),
        params = utils.GetUrlParams(),
        fixingOnce = utils.FilterFxingListUrl(source)
      if (!params.fixingListsTabIndex) {
        params.fixingListsTabIndex = 0
      }
      $el.html(`
          <li class="nav-item text-muted fixing-all">
            <a class="nav-link " href="#">全部（${allArrays.length}）</a>
          </li>
          <li class="nav-item text-muted fixing-online">
            <a class="nav-link " href="#" >在线（${onlineArrays.length}）</a>
          </li>
          <li class="nav-item text-muted fixing-offline">
            <a class="nav-link" href="#">离线（${offlineArrays.length}）</a>
          </li>`).off('click').on('click', 'li', function (e) {
          // 设置 css样式
          $(e.currentTarget)
            .removeClass('text-muted')
            .addClass('border-bottom text-white')
            .siblings()
            .removeClass('border-bottom text-white')
            .addClass('text-muted')
          // 获取 tabIndex
          params.fixingListsTabIndex = $(e.currentTarget).index()
          // 根据 tabIndex 设置默认 fixingId
          switch (Number.parseInt(params.fixingListsTabIndex)) {
            case 0:
              if (allArrays[0] && allArrays.length) params.fixingId = allArrays[0].entity_name
              break;
            case 1:
              if (onlineArrays[0] && onlineArrays.length) params.fixingId = onlineArrays[0].entity_name
              break;
            case 2:
              if (offlineArrays[0] && offlineArrays.length) params.fixingId = offlineArrays[0].entity_name
              break;
          }
          // 设置 url tabIndex fixingId 参数
          utils.SetUrlParams(params)
          // 通知 map fixing 更新 
          // marker 传递给 fixinglist 暂缓
          switch (pageName) {
            case 'index.html':
              Event.create('map').trigger('GetFixingList', map, source)
              break;
            case 'control.html':
              Event.create('map').trigger('GetFixingListOnce', map, fixingOnce)
              break;
            case 'trajectory.html':
              Event.create('map').trigger('GetFixingListOnce', map, fixingOnce)
              break;
          }
          Event.create('fixing').trigger('GetFixingList', map, source, fixing)
        })
        //  初始对应下标 tab css
        .find('li')
        .eq(params.fixingListsTabIndex)
        .removeClass('text-muted')
        .addClass('border-bottom text-white')
    }
  }

})($('.nav-tab-container'))

// 鞋垫列表模块
var fixingLists = (function ($el) {
  Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
    fixingLists.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, { currentPage, pageSize, marker }) {
      let cache = [],
        allArrays = Object.assign([], source),
        onlineArrays = utils.FilterFixingLists(source, 'entity_desc', '在线'),
        offlineArrays = utils.FilterFixingLists(source, 'entity_desc', '离线'),
        pageName = utils.GetUrlPageName(),
        params = utils.GetUrlParams()
      // url 无参数 默认 tabIndex 0
      if (!params.fixingListsTabIndex) {
        params.fixingListsTabIndex = 0
      }
      // 仅处理展示前10条数据
      let handleToCaches = (source) => {
        for (let index = currentPage * pageSize; index < (currentPage * pageSize) + pageSize; index++) {
          if (source[index]) cache.push(source[index])
        }
      }
      switch (Number.parseInt(params.fixingListsTabIndex)) {
        case 0:
          handleToCaches(allArrays)
          break;
        case 1:
          handleToCaches(onlineArrays)
          break;
        case 2:
          handleToCaches(offlineArrays)
          break;
      }
      // 处理 cache 数据
      cache = cache.map((item, index) => {
        let img, activeTextColor = 'text-muted'
        // url fixingid 存在设置对应id样式
        if (params.fixingId) {
          // 鞋垫id对比
          if (params.fixingId === item.entity_name) {
            activeTextColor = 'text-white'
          }
        } else {
          // 没有鞋垫id ，默认取数组下标0
          if (index === 0) {
            activeTextColor = 'text-white'
            // 并设置 url fixingId 参数
            params.fixingId = item.entity_name
            utils.SetUrlParams(params)
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
      })
      $el.html(cache).off('click').on('click', 'li', function (e) {
        let { entity_name, latest_location } = $(e.currentTarget).data(),
          { longitude, latitude } = latest_location
        params.fixingId = entity_name
        utils.SetUrlParams(params)

        let fixingOnce = utils.FilterFxingListUrl(source)
        // 设置 css样式
        $(e.currentTarget)
          .removeClass('text-muted')
          .addClass('text-white')
          .siblings()
          .removeClass('text-white')
          .addClass('text-muted')
        Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: longitude, lat: latitude })
        // 覆盖物单个once
        switch (pageName) {
          case 'control.html':
            Event.create('map').trigger('GetFixingListOnce', map, fixingOnce)
            break;
          case 'trajectory.html':
            Event.create('map').trigger('GetFixingListOnce', map, fixingOnce)
            break;
        }
        // BMapLib.EventWrapper.trigger(marker, "click")
      })
    }
  }
})($('.fixing-container'))

// 鞋垫列表分页模块
var fixingListsPagination = (function ($el) {
  Event.create('fixing').listen('GetFixingList', function (map, source, fixing) {
    fixingListsPagination.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      let cache = null,
        allArrays = Object.assign([], source),
        onlineArrays = utils.FilterFixingLists(source, 'entity_desc', '在线'),
        offlineArrays = utils.FilterFixingLists(source, 'entity_desc', '离线'),
        params = utils.GetUrlParams()
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
      }
      $el.jqPaginator({
        totalCounts: cache.length ? cache.length : 1,
        pageSize: fixing.pageSize,
        visiblePages: 5,
        currentPage: 1,
        prev: '<li class="prev pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">&lt;</a></li>',
        next: '<li class="next pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">	&gt;</a></li>',
        page: '<li class="page pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
          if (type === 'init') return
          // console.log('fixingListsPagination', num, type, fixing)
          Event.create('fixing').trigger('GetFixingList', map, cache, { currentPage: num - 1, pageSize: fixing.pageSize })
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
    refresh(map, source, { fixingId }) {
      console.log(fixingId)
      // loacl 获取数据
      let { AdminId } = utils.GetLoaclStorageUserInfo('userinfo')
      FIXING_API.GetFixingInfo({ adminId: AdminId, fixingId }).then(res => {
        console.log(res)
      })
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
    }
  }
})()

// 鞋垫指令
var fixingInstructions = (function ($el) {
  Event.create('fixing').listen('', function (map, source, fixing) {
    fixingInstructions.refresh()
  })

  return {
    refresh(map, source, fixing) {

    }
  }
})()

// 鞋垫二维码
var fixingQRCode = (function ($el) {
  Event.create('fixing').listen('', function (map, source, fixing) {
    fixingQRCode.refresh()
  })

  return {
    refresh(map, source, fixing) {

    }
  }
})()

// 鞋垫信息实时模块
var fixingInfoLive = (function ($el) {
  Event.create('fixing').listen('GetLastPosition', function (map, source, fixing) {
    fixingInfoLive.refresh()
  })

  return {
    refresh(map, source, fixing) {

    }
  }
})($('.live-info-tbody'))

// 鞋垫历史轨迹信息模块
var fixinTrajectory = (function ($el) {
  Event.create('fixing').listen('GetTrackList', function (map, source, fixing) {
    fixinTrajectory.refresh()
  })

  return {
    refresh(map, source, fixing) {

    }
  }
})($('.track-list-tbody'))
