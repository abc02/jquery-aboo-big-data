$('.home-button').click(function () {
  $('.slider-dialog').toggle()
})
$('.conctrol-button').click(function () {
  $('.slider-dialog').toggle()
})
$('.slider-doork').click(function () {
  $('.slider-dialog').hide()
})
$('.slider-close').click(function () {
  $('.slider-dialog').hide()
})
$('.bottom-doork').click(function () {
  $('.bottom-dialog').show()
  $(this).hide()
})
$('.bottom-doork-inner').click(function () {
  $('.bottom-dialog').hide()
  $('.bottom-doork').show()
})
$('.bottom-close').click(function () {
  $('.bottom-dialog').hide()
  $('.bottom-doork').show()
})
//百度地图API功能
var map = new BMap.Map("allmap");            // 创建Map实例
var point = new BMap.Point(120.618679, 28.028974); // 创建点坐标
map.centerAndZoom(point, 12);
map.enableScrollWheelZoom();                 //启用滚轮放大缩小
map.enableInertialDragging();

map.enableContinuousZoom();

var size = new BMap.Size(10, 20);
map.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,
    // 切换城市之间事件
    // onChangeBefore: function(){
    //    alert('before');
    // },
    // 切换城市之后事件
    // onChangeAfter:function(){
    //   alert('after');
    // }
}));
function financial(x) {
  return Number.parseFloat(x).toFixed(4);
}
function timestamp(date, isType) {
  if (!date) return ''
  if (String(date).length < 12) {
    date = Number.parseInt(date + '000')
  }
  let handleToYYYYMMDD = date => {
    let Year, Month, Day
    Year = date.getFullYear()
    Month = date.getMonth() + 1
    Day = date.getDate()
    return {
      YYYY: Year,
      MM: Month,
      DD: Day
    }
  }
  let handleToHHMMSSMS = date => {
    let Hours, Minutes, Seconds, Milliseconds
    Hours = date.getHours()
    Minutes = date.getMinutes()
    Seconds = date.getSeconds()
    Milliseconds = date.getMilliseconds()
    return {
      HH: Hours,
      MM: Minutes,
      SS: Seconds,
      MS: Milliseconds
    }
  }
  let handleToPad = (num, n = 2) => {
    if ((num + '').length >= n) return num
    return handleToPad('0' + num, n)
  }
  let YYYYMMDD = handleToYYYYMMDD(new Date(date))
  let HHMMSSMS = handleToHHMMSSMS(new Date(date))
  if (isType) {
    return `${YYYYMMDD.YYYY}-${handleToPad(YYYYMMDD.MM)}-${handleToPad(YYYYMMDD.DD)}`
  }
  return `${YYYYMMDD.YYYY}-${handleToPad(YYYYMMDD.MM)}-${handleToPad(YYYYMMDD.DD)} ${handleToPad(HHMMSSMS.HH)}:${handleToPad(HHMMSSMS.MM)}:${handleToPad(HHMMSSMS.SS)}`
}
axios.defaults.baseURL = 'https://datainterface.abpao.com/v1/xiedian_data'
axios.defaults.headers.common['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZG1pbklkIjoiMyIsImV4cCI6MTUzODI4OTgwM30.YkXr2kW9F58d0Nt9EjHLp1NgHoTN4Ykg7iqTHYzMiug'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'