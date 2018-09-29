
var STATISTICS_API = (function () {
  // 统计用户数据
  function StatisticsUserData({ adminId, time }) {
    return axios.post('/StatisticsUserData', Qs.stringify({ adminId, time }))
  }
  // 统计设备数据
  function AdminStatisticsFixingData({ adminId, time }) {
    return axios.post('/AdminStatisticsFixingData', Qs.stringify({ adminId, time }))
  }
  return {
    StatisticsUserData,
    AdminStatisticsFixingData
  }
})