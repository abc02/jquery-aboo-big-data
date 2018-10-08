var sportData = (function ($el) {
  Event.create('sportData').listen('GetFixingSportData', function (map, source, fixing) {
    sportData.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      if (!source) return
      let stepsOption = {
          title: {
            text: '计步数据'
          },
          xAxis: {
            data: []
          },
          yAxis: {},
          series: [{
            type: 'line',
            data: []
          }]
        },
        caloriesOption = {
          title: {
            text: '卡路里数据'
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
            text: '体重数据'
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
            text: '距离数据'
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
      // 指定图表的配置项和数据
      source.sportList.map(item => {
        let xAxis = `${utils.handleToYYYYMMDD(new Date(Number.parseInt(item.createTime + '000'))).DD}日`
        stepsOption.xAxis.data.push(xAxis)
        caloriesOption.xAxis.data.push(xAxis)
        weightOption.xAxis.data.push(xAxis)
        distanceOption.xAxis.data.push(xAxis)
        stepsOption.series[0].data.push(item.steps)
        caloriesOption.series[0].data.push(item.calorie)
        weightOption.series[0].data.push(item.weight)
        distanceOption.series[0].data.push(item.distance)
      })
      echarts.init($('#steps')[0], 'bigdata').setOption(stepsOption)
      echarts.init($('#calorie')[0], 'bigdata').setOption(caloriesOption)
      echarts.init($('#weight')[0], 'bigdata').setOption(weightOption)
      echarts.init($('#distance')[0], 'bigdata').setOption(distanceOption)
    }
  }
})()



var sportDataDatepicker = (function ($el) {
  Event.create('sportData').listen('GetFixingSportData', function (map, source, fixing) {
    sportDataDatepicker.refresh(map, source, fixing)
  })
  return {
    refresh(map, source, fixing) {
      $el.off('changeDate').one('changeDate', function (e) {
        console.log('changeDate')
        // loacl 获取数据
        let userInfo = utils.GetLoaclStorageUserInfo('userinfo'),
          data = $('#datepicker').datepicker('getDate'),
          params = utils.GetUrlParams()
        params.time = Math.round(new Date(data) / 1000) // update 日期

        console.log(data)
        utils.SetUrlParams(params)
        $('#datepicker').attr('value', utils.handleTimestampToDate(params.time))
        // 请求轨迹接口
        FIXING_API.GetFixingSportData({ adminId: userInfo.AdminId, fixingId: params.fixingId, times: params.time }).then(res => {
          if (res.data.ret === 1001) {
            Event.create('sportData').trigger('GetFixingSportData', null, res.data, params)
          }
          if (res.data.ret === 1002) {
            window.alert(res.data.code)
          }
        })
      })
    }
  }
})($('#datepicker'))