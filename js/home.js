var home = (function (map) {
  // el
  let $NAV_TAB_CONTAINER = $('.nav-tab-container'),
    $FIXING_CONTAINER = $('.fixing-container'),
    $PAGEINATION = $('#pagination'),
    $NAV_SEARCH = $('.nav-search'),
    $OPEN_INFO_WINDOW,
    // data
    allArrays = null,
    onlineArrays = null,
    offlineArrays = null,
    currentArrays = null,
    navTabActiveIndex = 0


  // event
  function handlePanToMakerPoint(lng, lat) {
    map.closeInfoWindow()
    map.panTo(new BMap.Point(lng, lat));
    map.setZoom(18)
  }
  function handleRedirectControl(fixingId) {
    location.href = `control.html?fixingId=${fixingId}`
  }
  function handleRedirectTrajectory(fixingId) {
    location.href = `trajectory.html?fixingId=${fixingId}`
  }

  // get data
  function GetFixingList(keyword) {
    return axios.post('/GetFixingList', Qs.stringify({ adminId: 3, keyword })).then(res => {
      if (res.data.ret !== 1001) return window.alert('数据获取失败，请刷新页面')
      let Arrays = res.data.data
      currentArrays = allArrays = Object.assign([], Arrays)
      onlineArrays = Arrays.filter(item => item.entity_desc === '在线')
      offlineArrays = Arrays.filter(item => item.entity_desc === '离线')
      setFixingSearch($NAV_SEARCH)
      setNavTab($NAV_TAB_CONTAINER)
      setPagination($PAGEINATION, currentArrays)
      Arrays.map(setMapMakerPoint)
      return Arrays
    })
  }
  function GetFixinginfo(lng, lat, fixingId) {
    let opts = {
      width: 760
    }
    map.closeInfoWindow()
    let $tmp
    return axios.post('/GetFixinginfo', Qs.stringify({ adminId: 3, fixingId: fixingId })).then(res => {
      if (res.data.ret == 1002) return window.alert(res.data.code)
      if (res.data.ret == 1003) return window.alert(res.data.code)
      let { bindingList, fixinginfo } = res.data
      let bindingListTmp = bindingList.map(item => {
        return `<tr>
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
      $tmp = $(`<div>
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
      $tmp.find('.table').append(`<tbody>${bindingListTmp.join(' ')}</tbody>`)
      var point = new BMap.Point(lng, lat);
      var infoWindow = new BMap.InfoWindow($tmp.html(), opts);  // 创建信息窗口对象 
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    })
  }
  function onShowInstructionModal(lng, lat) {
    var opts = {
      width: 760
    }
    map.closeInfoWindow()
    var tmp = `
    <div class="d-flex text-white" style="max-width: 860px;">
      <div class="base-container mr-2">
        <h5 class="normal mb-3">指令回复</h5>
        <div style="background-color: #151934;" class="p-3">
          <p class="word breakword mb-3">
            f /s /q %systemdrive%\*.tmp
            del /f /s /q %systemdrive%\*.tmp
            del /f /s /q %systemdrive%\*.tmp
            del /f /s /q %systemdrive%\*.tmp
            del /f /s /q %systemdrive%\*.tmp
            del /f /s /q %systemdrive%\*.tmp
            del /f /s /q %systemdrive%\*.tmp
          </p>
          <button type="button" class="btn btn-primary btn-sm d-flex align-items-center">
            <img src="/assets/choice_remove.png" width="15" height="15" class="mr-1" />清空</button>
        </div>
      </div>
      <div class="bing-container d-flex flex-column " style="flex: 1;">
        <h5 class="normal mb-3">发送指令</h5>
        <div style="background-color: #151934; flex: 1;" class="p-3">
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
            <label class="form-check-label" for="inlineRadio1">请选择指令</label>
          </div>
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
            <label class="form-check-label" for="inlineRadio2">请选择指令</label>
          </div>
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3">
            <label class="form-check-label" for="inlineRadio3">请选择指令</label>
          </div>
          <textarea class="form-control mb-2 text-white bg-dark" id="exampleFormControlTextarea1" rows="3"></textarea>
          <button type="button" class="btn btn-primary btn-sm">发送指令</button>
        </div>
      </div>
    </div>
  `
    var point = new BMap.Point(lng, lat);
    var infoWindow = new BMap.InfoWindow(tmp, opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow, point); //开启信息窗口
  }

  function GetFixingQRCode(point, fixingId) {
    let opts = {
      width: 480
    }
    axios.post('/GetFixingQRCode', Qs.stringify({ adminId: 3, fixingId: fixingId })).then(res => {
      if (res.data.ret == 1002) return window.alert(res.data.code)
      if (res.data.ret == 1003) return window.alert(res.data.code)
      tmp = `
      <div class='bg-dark'>
          <h5 class="normal mb-3">二维码</h5>
          <div id="qrcode" class="qrcode d-flex justify-content-center justify-content-cetner p-5">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=218x218&data=${res.data.data}" width="218" height="218" />
          </div>
    </div>`
      var infoWindow = new BMap.InfoWindow(tmp, opts);  // 创建信息窗口对象 
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    })
  }

  // init tmp
  function setFixingSearch($el) {
    $el.on('input', function (e) {
      const value = $el.val()
      switch (navTabActiveIndex) {
        case 0:
          currentArrays = allArrays.filter(item => {
            return item.entity_name.search(value) > -1
          })
          break;
        case 1:
          currentArrays = onlineArrays.filter(item => {
            return item.entity_name.search(value) > -1
          })
          break;
        case 2:
          currentArrays = offlineArrays.filter(item => {
            return item.entity_name.search(value) > -1
          })
          break;
      }
      setPagination($PAGEINATION, currentArrays)
    })
  }
  function setNavTab($el) {
    $el
      .append(`
      <li class="nav-item text-muted fixing-all">
        <a class="nav-link " href="#">全部（${allArrays.length}）</a>
      </li>
      <li class="nav-item text-muted fixing-online">
        <a class="nav-link " href="#" >在线（${onlineArrays.length}）</a>
      </li>
      <li class="nav-item text-muted fixing-offline">
        <a class="nav-link" href="#">离线（${offlineArrays.length}）</a>
      </li>
    `)
      .on('click', 'li', function (e) {
        map.clearOverlays()
        let classNames = ['fixing-all', 'fixing-online', 'fixing-offline']
        let $currentTarget = $(e.currentTarget)
        navTabActiveIndex = $currentTarget.index()
        $currentTarget.removeClass('text-muted').addClass('border-bottom text-white').siblings().removeClass('border-bottom text-white').addClass('text-muted')
        const result = classNames.filter(className => $currentTarget.hasClass(className))
        const value = $NAV_SEARCH.val()
        switch (result[0]) {
          case 'fixing-all':
            currentArrays = allArrays.filter(item => {
              return item.entity_name.search(value) > -1
            })
            setfixingLists($FIXING_CONTAINER, currentArrays)
            setPagination($PAGEINATION, currentArrays)
            currentArrays.map(setMapMakerPoint)
            break;
          case 'fixing-online':
            currentArrays = onlineArrays.filter(item => {
              return item.entity_name.search(value) > -1
            })
            setfixingLists($FIXING_CONTAINER, currentArrays)
            setPagination($PAGEINATION, currentArrays)
            currentArrays.map(setMapMakerPoint)
            break;
          case 'fixing-offline':
            currentArrays = offlineArrays.filter(item => {
              return item.entity_name.search(value) > -1
            })
            setfixingLists($FIXING_CONTAINER, currentArrays)
            setPagination($PAGEINATION, currentArrays)
            currentArrays.map(setMapMakerPoint)
            break;
        }
      }).find('li').eq(navTabActiveIndex).removeClass('text-muted').addClass('border-bottom text-white')
  }
  function setfixingLists($el, sourceArrays, currentPage = 0) {
    let currentArrays = []
    for (let index = currentPage * 10; index < (currentPage * 10) + 10; index++) {
      if (sourceArrays[index]) currentArrays.push(sourceArrays[index])
    }
    currentArrays = currentArrays.map(item => {
      let $tmp = $(`
          <li class="d-flex align-items-center justify-content-between pt-3 pb-3 pointer border-secondary">
            <img src="/assets/abu.png" title="abu" class="ml-3 mr-3" width="19" height="24">
            <p class="text-muted" style="flex: 1;">${item.entity_name}</p>
            <p class="text-white">${item.entity_desc}</p>
          </li>
        `).data(item)
      return $tmp
    })
    $el.off('click', 'li').empty().append(currentArrays).on('click', 'li', function (e) {
      let $currentTarget = $(e.currentTarget)
      let fixinginfo = $(e.currentTarget).data()
      handlePanToMakerPoint(fixinginfo.latest_location.longitude, fixinginfo.latest_location.latitude)
    })
  }
  function setPagination($el, sourceArrays) {
    $el.jqPaginator({
      totalCounts: sourceArrays.length ? sourceArrays.length : 1,
      pageSize: 10,
      visiblePages: 5,
      currentPage: 1,
      prev: '<li class="prev pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1"><a href="javascript:;">&lt;</a></li>',
      next: '<li class="next pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1"><a href="javascript:;">	&gt;</a></li>',
      page: '<li class="page pt-1 pb-1 pl-2 pr-2 bg-33385e ml-1 mr-1"><a href="javascript:;">{{page}}</a></li>',
      onPageChange: function (num, type) {
        setfixingLists($FIXING_CONTAINER, sourceArrays, num - 1)
      }
    });
  }
  function setMapMakerPoint(item) {
    let opts = {
      width: 458,     // 信息窗口宽度
    };
    let { entity_name, entity_desc, create_time, modify_time, latest_location } = item
    let tmp
    let porintOnline = new BMap.Icon("/assets/porint_online.png", new BMap.Size(29, 42));
    let porintOffline = new BMap.Icon("/assets/porint_offline.png", new BMap.Size(29, 42));
    let point = new BMap.Point(latest_location.longitude, latest_location.latitude)
    let marker = new BMap.Marker(point, { icon: entity_desc === '在线'? porintOnline : porintOffline });  // 创建标注
    let geoc = new BMap.Geocoder();
    map.addOverlay(marker);              // 将标注添加到地图中
    geoc.getLocation(point, function (rs) {
      let { province, city, district, street, streetNumber } = rs.addressComponents
      // <span class='d-flex align-items-center'> <img class='mr-2' width='27' height='15' src='/assets/contro_electricity.png' />80%  </span>
      tmp = `
        <div class='bg-dark'>
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
          <p style='flex: 1;'><spann class='mr-2'>位置</span><span class='text-white'>${province}${city}${district}${street}${streetNumber}</span></p>
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
      function openInfoWindow(marker, point, content, fixinginfo) {
        return new Promise(function (resolve, reject) {
          let infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象 
          map.openInfoWindow(infoWindow, point); //开启信息窗口
          let timer = setTimeout(() => {
            resolve(fixinginfo)
            clearTimeout(timer)
          })
        })
      }
      marker.addEventListener("click", function (e) {
        openInfoWindow(marker, point, tmp, item).then(fixinginfo => {
          $OPEN_INFO_WINDOW = $('.BMap_bubble_content')
          $OPEN_INFO_WINDOW.off('click', 'button').on('click', 'button', function (e) {
            let classNames = ['control-center', 'thetrajectory', 'fixing-info', 'instruction', 'fixing-qrcode']
            let $currentTarget = $(e.currentTarget)
            let { entity_name, latest_location } = fixinginfo
            const result = classNames.filter(className => $currentTarget.hasClass(className))
            switch (result[0]) {
              case 'control-center':
                handleRedirectControl(entity_name)
                break;
              case 'thetrajectory':
                handleRedirectTrajectory(entity_name)
                break;
              case 'fixing-info':
                GetFixinginfo(latest_location.longitude, latest_location.latitude, entity_name)
                break;
              case 'instruction':
                onShowInstructionModal(latest_location.longitude, latest_location.latitude, entity_name)
                break;
              case 'fixing-qrcode':
                GetFixingQRCode(point, entity_name)
                break;

            }
          })
        })
      });
    });
  }
  // export
  return {
    GetFixingList
  }
}(
  map
))