// 控制中心模块
var control = (function (pageName) {
  var userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) login.redirect('login')

  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')

  var persons = []  // 存储获取到的数据
  function handlerFile(e) {
    var files = e.target.files,
      fileName = files[0].name,
      fileSize = `大小：${(files[0].size / 1024).toFixed(0)}kb`
    fileReader = new FileReader()
    fileReader.onload = function (ev) {
      try {
        var data = ev.target.result,
          workbook = XLSX.read(data, {
            type: 'binary'
          }) // 以二进制流方式读取得到整份excel表格对象
        // persons = []; // 存储获取到的数据
      } catch (e) {
        console.log('文件类型不正确');
        return;
      }

      // 表格的表格范围，可用于判断表头是否数量是否正确
      var fromTo = '';
      console.log(workbook)
      // 遍历每张表读取
      for (var sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          fromTo = workbook.Sheets[sheet]['!ref'];
          console.log(fromTo);
          for (var page in workbook.Sheets[sheet])
            switch (page) {
              case '!margins':
                break;
              case '!ref':
                break;
              default:
                persons.push(workbook.Sheets[sheet][page].v)
                break;
            }
          // persons = persons.concat(XLSX.utils.sheet_to_csv(workbook.Sheets[sheet], ','));
          break; // 如果只取第一张表，就取消注释这行
        }
      }
      $('.file-name').text(fileName)
      $('.file-size').text(fileSize)
      $('.file-result').show()
      console.log(persons);
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  }
  $('#excel-file').on('change', handlerFile);
  $('#restart-file').on('change', handlerFile);
  $('#update-file').on('click', function () {
    FIXING_API.BatchAddFixing({ adminId: userInfo.AdminId, batchId: '', fixingIds: persons.join(',') }).then(res => {
      if (res.data.ret === 1001) {
        $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
        $('#no-data-ModalCenter').modal('show')
      }
      if (res.data.ret === 1002) {
        $('#no-data-ModalCenter').find('.no-data-container').text(res.data.code)
        $('#no-data-ModalCenter').modal('show')
      }
    })
  })
  var params = utils.GetUrlParams()
  // init url params page, pageSize, tabindex1
  params.currentPage = 0
  params.pageSize = 5
  params.fixingListsTabIndex = 0
  utils.SetUrlParams(params)
  var fixing = {
    currentTime: utils.handleTimestampToDate(new Date()),//当天
    type: 'init'
  }
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    Event.create('fixing').trigger('control', map, res.data.data, params, fixing)
    if (params && params.fixingId) {
      if (window.setIntervaler) {
        map.clearOverlays()
        clearInterval(window.setIntervaler)
      }
      var item = utils.FilterFxingListUrl(res.data.data)[0]
      fixing.point = new BMap.Point(item.latest_location.longitude, item.latest_location.latitude)
      fixing.fixingId = item.entity_name
      fixing.isTrigger = true

      Event.create('map').trigger('mapPanToMarkerPoint', map, fixing.point)
      Event.create('fixing').trigger('GetLastPosition', map, item, params, fixing)
      window.setIntervaler = setInterval(() => {
        fixing.type = 'update'
        fixing.isTrigger = false
        Event.create('fixing').trigger('GetLastPosition', map, item, params, fixing)
      }, 60000)
    }
  })
})('control')