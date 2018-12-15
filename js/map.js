//百度地图API功能
var map = (function (BMap) {
  if (location.href.search('sportdata') > -1 || location.href.search('login') > -1) return null
  var baiduMap = new BMap.Map("baidumap"),        // 创建Map实例
    point = new BMap.Point(116.331398, 39.897445); // 默认北京
  baiduMap.centerAndZoom(point, 14);
  baiduMap.enableContinuousZoom(); // 启用连续缩放效果，默认禁用
  baiduMap.enableScrollWheelZoom();  // 启用滚轮放大缩小
  baiduMap.enableInertialDragging(); // 启用地图惯性拖拽，默认禁用
  getLocalCity()

  function getLocalCity() {
    var cityName, currentCity = new BMap.LocalCity(); // IP定位城市
    currentCity.get(function (result) {
      cityName = result.name
      baiduMap.setCenter(cityName)
    })
  }


  // 地图加载完毕
  baiduMap.addEventListener("tilesloaded", () => {

  });


  var mapType1 = new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP], anchor: BMAP_ANCHOR_TOP_RIGHT, offset: new BMap.Size(10, 10) })
  var overView = new BMap.OverviewMapControl()
  var overViewOpen = new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT })
  var CityListControl = new BMap.CityListControl({ anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(10, 10) })
  var DistanceTool = new BMapLib.DistanceTool(baiduMap)
  baiduMap.addControl(mapType1);          //2D图，混合图
  baiduMap.addControl(overView);          //添加默认缩略地图控件
  baiduMap.addControl(overViewOpen);      //右下角，打开
  baiduMap.addControl(CityListControl);
  // 定义一个控件类,即function
  function DistanceControl() {
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(100, 10);
  }

  // 通过JavaScript的prototype属性继承于BMap.Control
  DistanceControl.prototype = new BMap.Control();

  // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
  // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
  DistanceControl.prototype.initialize = function (map) {
    var div = $(`
    <button class="btn btn-primary btn-sm" type="button">
      测距
    </button>`).get(0)
    // 绑定事件,点击一次放大两级
    div.onclick = function (e) {
      DistanceTool.open()
    }
    // 添加DOM元素到地图中
    map.getContainer().appendChild(div);
    // 将DOM元素返回
    return div;
  }
  // 定义一个控件类,即function
  function SelectModeControl() {
    // 默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new BMap.Size(160, 10);
  }

  // 通过JavaScript的prototype属性继承于BMap.Control
  SelectModeControl.prototype = new BMap.Control();

  // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
  // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
  SelectModeControl.prototype.initialize = function (map) {
    // 创建一个DOM元素
    var div = $(`<div class="reltive">
    <button class="btn btn-primary btn-sm" type="button">
      定位类型
    </button>
    <div class="mode-container reltive absolute-top-left bg-white pt-1 pb-1 pl-2 pr-2 shadow-bottom" style="display: none; margin-top: 45px; min-width: 160px;">
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="modegps" checked>
        <label class="custom-control-label" for="modegps">卫星定位</label>
      </div>
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="modelbs" checked>
        <label class="custom-control-label" for="modelbs">基站定位</label>
      </div>
      <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" id="modewifi" checked>
        <label class="custom-control-label" for="modewifi">无线定位</label>
      </div>
      <div class="arrow-up absolute-top-left" style="transform: translateY(-99%);"></div>
    </div>
  </div>`).get(0)
    div.children[0].addEventListener('click', function (e) {
      if (div.children[1].style.display === 'none') {
        div.children[1].style.display = 'block'
      } else {
        div.children[1].style.display = 'none'
      }
    })
    map.getContainer().appendChild(div);
    // 将DOM元素返回
    return div;
  }
  // 创建控件
  var SelectModeControl = new SelectModeControl();
  // 创建控件
  var DistanceControl = new DistanceControl();
  // 添加到地图当中
  baiduMap.addControl(DistanceControl);
  if(utils.GetUrlPageName() === 'trajectory') baiduMap.addControl(SelectModeControl);
  

  var menu = new BMap.ContextMenu();
  var txtMenuItem = [
    {
      text: '测距',
      callback: function () { DistanceTool.open() }
    },
  ];
  for (var i = 0; i < txtMenuItem.length; i++) {
    menu.addItem(new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100));
  }
  baiduMap.addContextMenu(menu);
  return baiduMap
})(BMap)