//百度地图API功能
var map = (function (BMap) {
  if (location.href.search('sportdata') > -1 || location.href.search('login') > -1) return null
  let baiduMap = new BMap.Map("baidumap"),        // 创建Map实例
    point = new BMap.Point(116.331398, 39.897445); // 默认北京
  baiduMap.centerAndZoom(point, 14);
  baiduMap.enableContinuousZoom(); // 启用连续缩放效果，默认禁用
  baiduMap.enableScrollWheelZoom();  // 启用滚轮放大缩小
  baiduMap.enableInertialDragging(); // 启用地图惯性拖拽，默认禁用
  getLocalCity()

  function getLocalCity() {
    let cityName, currentCity = new BMap.LocalCity(); // IP定位城市
    currentCity.get(function (result) {
      cityName = result.name
      baiduMap.setCenter(cityName)
    })
  }


  // 地图加载完毕
  baiduMap.addEventListener("tilesloaded", () => {

  });

  let size = new BMap.Size(10, 20);
  baiduMap.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,
    // 切换城市之间事件
    onChangeBefore: function () {
      console.log(baiduMap.getCurrentCity())
      console.log('before');
    },
    // 切换城市之后事件
    onChangeAfter: function (e) {
      console.log(baiduMap.getCurrentCity())
      console.log('after');
    }
  }));
  return baiduMap
})(BMap)