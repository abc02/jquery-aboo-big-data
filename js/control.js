// 控制中心模块
var control = (function (pageName) {
  if (!(utils.GetUrlPageName().search(pageName) > -1)) {
    return
  }
  let userInfo = utils.GetLoaclStorageUserInfo('userinfo')
  if (!userInfo) {
    login.redirect('login')
  }
  Event.create('header').trigger('loginSuccess', userInfo)
  Event.create('navigationMenu').trigger('loginSuccess')

  let persons = []  // 存储获取到的数据
  function handlerFile(e) {
    let files = e.target.files,
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
      alert(res.data.code)
    })
  })
  FIXING_API.GetFixingList({ adminId: userInfo.AdminId, keyword: '中国' }).then(res => {
    let fixingOnce = utils.FilterFxingListUrl(res.data.data),
      { latest_location } = fixingOnce[0],
      { longitude, latitude } = latest_location,
      params = utils.GetUrlParams()
    if (!params.currentPage) params.currentPage = 0
    if (!params.pageSize) params.pageSize = 6
    utils.SetUrlParams(params)
    Event.create('map').trigger('mapPanToMarkerPoint', map, { lng: longitude, lat: latitude })

    // Event.create('map').trigger('GetFixingListOnce', map, fixingOnce, { ...params, type: 'init' })
    Event.create('map').trigger('GetFixingListOnce', map, fixingOnce, { ...params, type: 'init' })
    Event.create('fixing').trigger('GetLastPosition', map, fixingOnce, { ...params, type: 'init' })
    window.setIntervaler = setInterval(function () {
      Event.create('map').trigger('GetLastPosition', map, fixingOnce, { ...params, type: 'update' })
      Event.create('fixing').trigger('GetLastPosition', map, fixingOnce, { ...params, type: 'update' })
    }, 60000)
    Event.create('fixing').trigger('GetFixingList', map, res.data.data, params)
  })
})('control')