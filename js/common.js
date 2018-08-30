$('.slider-home-button').click(function () {
  $('.slider-dialog').toggle()
})
$('.slider-doork').click(function () {
  $('.slider-dialog').hide()
})
$('.slider-close').click(function () {
  $('.slider-dialog').hide()
})
//百度地图API功能
var map = new BMap.Map("allmap");            // 创建Map实例
var point = new BMap.Point(120.618679, 28.028974); // 创建点坐标
map.centerAndZoom(point, 12);
map.enableScrollWheelZoom();                 //启用滚轮放大缩小