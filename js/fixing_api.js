

var FIXING_API = (function () {
  // 获取设备列表
  function GetFixingList({ adminId, keyword }) {
    return axios.post('/GetFixingList', Qs.stringify({ adminId, keyword }))
  }
  // 后台获取鞋垫详情
  function GetFixingInfo({ adminId, fixingId }) {
    // map.closeInfoWindow()
    return axios.post('/GetFixinginfo', Qs.stringify({ adminId, fixingId }))
      // Event.trigger('setFixingInfoWindow', { fixingId, ...res.data }, { lng, lat })
      // return res.data
  }
  // 获取二维码
  function GetFixingQRCode({ adminId, fixingId }, { lng, lat }) {
    return axios.post('/GetFixingQRCode', Qs.stringify({ adminId, fixingId })).then(res => {
      if (!res) return
      Event.trigger('setFixingQRCodeWindow', res.data.data, { lng, lat })
      return res.data
    })
  }
  // 获取鞋垫运动数据（时间戳前7天）
  function GetFixingSportData({ adminId, fixingId, times }) {
    return axios.post('/GetFixingSportData', Qs.stringify({ adminId, fixingId, times }))
  }
  // 获取鞋垫最近一次定位
  function GetLastPosition({ adminId, fixingId }) {
    return axios.post('/GetLastPosition', Qs.stringify({ adminId, fixingId }))
    //   if (!res) return
    //   // 第一次获取
    //   if (isFirstGetLastPosition) {
    //     Event.trigger('setLiveInfo', $LIVE_INFO_TBODY, { ...res.data, fixingId })
    //     isFirstGetLastPosition = false
    //     oldliveinfo = Object.assign({}, { ...res.data, fixingId })
    //     return res.data
    //   }
    //   // 对比设备id
    //   if (oldliveinfo.fixingId !== fixingId) {
    //     $LIVE_INFO_TBODY.empty()
    //     Event.trigger('setLiveInfo', $LIVE_INFO_TBODY, { ...res.data, fixingId })
    //     oldliveinfo = Object.assign({}, { ...res.data, fixingId })
    //     return res.data
    //   }
    //   // 对比更新时间
    //   if (oldliveinfo.createTime !== res.data.createTime) {
    //     console.log(oldliveinfo.createTime, res.data.createTime)
    //     Event.trigger('setLiveInfo', $LIVE_INFO_TBODY, { ...res.data, fixingId })
    //     oldliveinfo = Object.assign({}, { ...res.data, fixingId })
    //     return res.data
    //   }
    //   return res.data
    // })
  }
  // 获取指定时间戳内的轨迹（文字列表）
  function GetTrackList({ adminId, fixingId, time }) {
    return axios.post('/GetTrackList', Qs.stringify({ adminId, fixingId, time }))
  }
  // 后台获取命令代码
  function AdminGetInstructionsList({ adminId }, { lng, lat }) {
    return axios.post('/AdminGetInstructionsList', Qs.stringify({ adminId }))
  }
    // let opts = {
    //   width: 760
    // }, $content, $instructionslists
    // map.closeInfoWindow()
    // return axios.post('/AdminGetInstructionsList', Qs.stringify({ adminId })).then(res => {
    //   if (!res) return
    //   $instructionslists = res.data.data.map(item => {
    //     // <img src="/assets/choice_checkmark.png" alt="choice_checkmark" class="rounded-circle mr-2 ml-2" width="20" height="20">
    //     return $(`<div class="form-check">
    //     <label class="form-check-label pointer d-flex flex-row mb-2" for="inlineRadio${item.Id}">
    //     <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio${item.Id}" value="${item.Instructions}">
    //       ${item.Content}
    //       </label>
    //     </div>`)
    //   })
    //   $content = $(`<div>

    //   <div class="d-flex text-white" style="max-width: 860px;">
    //     <div class="base-container mr-2">
    //       <h5 class="normal mb-3">指令回复</h5>
    //       <div style="background-color: #151934;" class="p-3">
    //         <p class="word breakword mb-3">
    //           f /s /q %systemdrive%\*.tmp
    //           del /f /s /q %systemdrive%\*.tmp
    //           del /f /s /q %systemdrive%\*.tmp
    //           del /f /s /q %systemdrive%\*.tmp
    //           del /f /s /q %systemdrive%\*.tmp
    //           del /f /s /q %systemdrive%\*.tmp
    //           del /f /s /q %systemdrive%\*.tmp
    //         </p>
    //         <button type="button" class="btn btn-primary btn-sm d-flex align-items-center">
    //           <img src="/assets/choice_remove.png" width="15" height="15" class="mr-1" />清空</button>
    //       </div>
    //     </div>
    //     <div class="bing-container d-flex flex-column " style="flex: 1;">
    //       <h5 class="normal mb-3">发送指令</h5>
    //       <form class="instructions-form">
    //         <div style="background-color: #151934; flex: 1;" class="p-3">
    //           <div class="instructions-container">
    //           </div>
    //           <textarea class="form-control mb-2 text-white bg-dark" id="instructionsControlTextarea" rows="3"></textarea>
    //           <button type="submit" class="btn btn-primary btn-sm">发送指令</button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>`)
    //   $content.find('.instructions-container').append($instructionslists)
    //   let point = new BMap.Point(lng, lat);
    //   let infoWindow = new BMap.InfoWindow($content.html(), opts);  // 创建信息窗口对象 
    //   // 注册事件
    //   BMapLib.EventWrapper.addListener(infoWindow, 'open', function (e) {
    //     Event.trigger('connectWebsocket')
    //     //绑定信息框的单击事件
    //     $(".instructions-container").off('click').on("click", 'label', function (e) {
    //       $('#instructionsControlTextarea').text($(e.currentTarget).find('input').val())
    //     })
    //     $(".instructions-form").off('click').submit("click", function (e) {
    //       e.preventDefault()
    //       let value = $(e.currentTarget).find('#instructionsControlTextarea').text()
    //       if (!value) return alert('请选择发送指令')
    //     })
    //   })

    //   map.openInfoWindow(infoWindow, point); //单击marker显示InfoWindow
    // })
  // 获取指定时间戳内的设备操作指令
  function AdminGetInstructions({ adminId, fixingId, time }) {
    return axios.post('/AdminGetInstructions', Qs.stringify({ adminId, fixingId, time }))
  }
  // 获取设备列表（搜索）
  function GetFixingListForSearch({ adminId, query }) {
    return axios.post('/GetFixingListForSearch', Qs.stringify({ adminId, query }))
  }
  // 批量添加新鞋垫
  function BatchAddFixing({ adminId, batchId, fixingIds }) {
    return axios.post('/BatchAddFixing', Qs.stringify({ adminId, batchId, fixingIds }))
  }
  return {
    GetFixingList,
    GetFixingInfo,
    GetFixingQRCode,
    GetFixingSportData,
    GetLastPosition,
    GetTrackList,
    AdminGetInstructionsList,
    AdminGetInstructions,
    GetFixingListForSearch,
    BatchAddFixing
  }
})()