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
//           case 0:
//             cache = utils.FilterFixingListsSearch(allArrays, KEY, VALUE)
//             break;
//           case 1:
//             cache = utils.FilterFixingListsSearch(onlineArrays, KEY, VALUE)
//             break;
//           case 2:
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
        params = utils.GetUrlParams()
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
          //  css 样式
          $(e.currentTarget)
            .removeClass('text-muted')
            .addClass('border-bottom text-white')
            .siblings()
            .removeClass('border-bottom text-white')
            .addClass('text-muted')
          // url 参数 
          params.fixingListsTabIndex = $(e.currentTarget).index()
          utils.SetUrlParams(params)
          switch (params.fixingListsTabIndex) {
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
          Event.create('fixing').trigger('GetFixingList', map, source, fixing)
          Event.create('map').trigger('GetFixingList', map, source, fixing)
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
        params = utils.GetUrlParams()
      if (!params.fixingListsTabIndex) {
        params.fixingListsTabIndex = 0
      }
      // url 参数 
      switch (params.fixingListsTabIndex) {
        case 0:
          for (let index = currentPage * pageSize; index < (currentPage * pageSize) + pageSize; index++) {
            if (allArrays[index]) cache.push(allArrays[index])
          }
          break;
        case 1:
          for (let index = currentPage * pageSize; index < (currentPage * pageSize) + pageSize; index++) {
            if (onlineArrays[index]) cache.push(onlineArrays[index])
          }
          break;
        case 2:
          for (let index = currentPage * pageSize; index < (currentPage * pageSize) + pageSize; index++) {
            if (offlineArrays[index]) cache.push(offlineArrays[index])
          }
          break;
      }

      cache = cache.map((item, index) => {
        let img,
          activeTextColor = 'text-muted',
          { fixingId } = utils.GetUrlParams()
        if (fixingId) {
          // 鞋垫id对比
          if (fixingId === item.entity_name) {
            activeTextColor = 'text-white'
          }
        } else {
          // 没有鞋垫id ，默认取数组下标0
          if (index === 0) {
            activeTextColor = 'text-white'
            let params = utils.GetUrlParams()
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
        let { latest_location } = $(e.currentTarget).data(),
          { longitude, latitude } = latest_location
        Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: longitude, lat: latitude })
        BMapLib.EventWrapper.trigger(marker, "click");
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
      $el.jqPaginator({
        totalCounts: source.length ? source.length : 1,
        pageSize: fixing.pageSize,
        visiblePages: 5,
        currentPage: 1,
        prev: '<li class="prev pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">&lt;</a></li>',
        next: '<li class="next pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">	&gt;</a></li>',
        page: '<li class="page pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1 text-white"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
          if (type === 'init') return
          Event.create('fixing').trigger('GetFixingList', map, source, { currentPage: num - 1, ...fixing })
        }
      })
    }
  }
})($('#pagination'))

// 鞋垫信息实时模块
var fixingInfoLive = (function ($el) {

})($('.live-info-tbody'))

// 鞋垫历史轨迹信息模块
var fixinTrajectory = (function ($el) {

})($('.track-list-tbody'))
