

var FIXING_API = (function () {
  // 获取设备列表
  function GetFixingList({ adminId, keyword }) {
    return axios.post('/GetFixingList', Qs.stringify({ adminId, keyword }))
  }
  // 后台获取鞋垫详情
  function GetFixingInfo({ adminId, fixingId }) {
    return axios.post('/GetFixinginfo', Qs.stringify({ adminId, fixingId }))
  }
  // 获取二维码
  function GetFixingQRCode({ adminId, fixingId }) {
    return axios.post('/GetFixingQRCode', Qs.stringify({ adminId, fixingId }))
  }
  // 获取鞋垫运动数据（时间戳前7天）
  function GetFixingSportData({ adminId, fixingId, times }) {
    return axios.post('/GetFixingSportData', Qs.stringify({ adminId, fixingId, times }))
  }
  // 获取鞋垫最近一次定位
  function GetLastPosition({ adminId, fixingId }) {
    return axios.post('/GetLastPosition', Qs.stringify({ adminId, fixingId }))
  }
  // 获取指定时间戳内的轨迹（文字列表）
  function GetTrackList({ adminId, fixingId, time }) {
    return axios.post('/GetTrackList', Qs.stringify({ adminId, fixingId, time }))
  }
  // 后台获取命令代码
  function AdminGetInstructionsList({ adminId }) {
    return axios.post('/AdminGetInstructionsList', Qs.stringify({ adminId }))
  }
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