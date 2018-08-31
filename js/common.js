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