var utils = (function () {
  function setFixingIdRedirectUrl(map, url) {
    var titleHHTML = map.getInfoWindow().getTitle(),
      titleNode = document.createRange().createContextualFragment(titleHHTML),
      fixingId = titleNode.textContent,
      params = utils.GetUrlParams()

    params.fixingId = fixingId
    return location.assign(`${url}.html?${Qs.stringify(params)}`)
  }
  function GetUrlPageName() {
    var pageName = location.pathname.substr(1).replace('.html', '')
    return pageName ? pageName : 'index'
  }
  function GetUrlParams() {
    return Qs.parse(location.search.substr(1))
  }
  function SetUrlParams(params) {
    var paramsStringify = Qs.stringify(params),
      url = `${location.pathname}?${paramsStringify}`
    history.pushState({ url: url, title: document.title }, document.title, url)
    return Qs.parse(paramsStringify)
  }
  function setUrlToTableIndex(index) {
    var url = `${location.origin}${location.pathname}${location.search}#${index}`
    location.assign(url)
    return index
  }
  function handleTimeToUnix(data) {
    return Math.round(new Date(data) / 1000)
  }
  function handleToCut(num, n = 2) {
    return Number.parseFloat(num).toFixed(n);
  }
  function handleToPad(num, n = 2) {
    if ((num + '').length >= n) return num
    return handleToPad('0' + num, n)
  }
  function handleToYYYYMMDD(date) {
    var Year, Month, Day
    Year = date.getFullYear()
    Month = date.getMonth() + 1
    Day = date.getDate()
    return {
      YYYY: Year,
      MM: Month,
      DD: Day
    }
  }
  function handleToHHMMSSMS(date) {
    var Hours, Minutes, Seconds, Milliseconds
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
  function handleTimestampToDate(date) {
    if (!date) return ''
    if (String(date).length < 12) {
      date = Number.parseInt(date + '000')
    }
    var YYYYMMDD = utils.handleToYYYYMMDD(new Date(date))
    return `${YYYYMMDD.YYYY}-${handleToPad(YYYYMMDD.MM)}-${handleToPad(YYYYMMDD.DD)}`
  }
  function handleTimestampToDateTime(date) {
    if (!date) return ''
    if (String(date).length < 12) {
      date = Number.parseInt(date + '000')
    }
    var YYYYMMDD = utils.handleToYYYYMMDD(new Date(date)),
      HHMMSSMS = utils.handleToHHMMSSMS(new Date(date))
    return `${YYYYMMDD.YYYY}-${handleToPad(YYYYMMDD.MM)}-${handleToPad(YYYYMMDD.DD)} ${handleToPad(HHMMSSMS.HH)}:${handleToPad(HHMMSSMS.MM)}:${handleToPad(HHMMSSMS.SS)}`
  }
  function SetLoaclStorageUserInfo(key, userInfo) {
    window.localStorage.setItem(key, JSON.stringify(userInfo))
    return userInfo
  }
  function GetLoaclStorageUserInfo(key) {
    return JSON.parse(window.localStorage.getItem(key))
  }
  function DelLoaclStorageUserInfo(key) {
    return window.localStorage.removeItem(key)
  }
  function GetUserInfo() {
    return userInfo
  }
  function SetUserInfo(newUserInfo) {
    return userInfo = newUserInfo
  }
  function FilterFixingLists(source, key, value) {
    return source.filter(item => item[key] === value)
  }
  function FilterFixingListsSearch(source, key, value) {
    return source.filter(item => item[key].search(value) > -1)
  }
  function FilterFxingListUrl(source) {
    var { fixingListsTabIndex, fixingId } = utils.GetUrlParams()
    if (fixingId) {
      // 根据鞋垫id 过滤
      return utils.FilterFixingLists(source, 'entity_name', fixingId)
    } else {
      // 根据列表tab下标 过滤
      switch (fixingListsTabIndex) {
        case '0':
          return source
        case '1':
          return utils.FilterFixingLists(source, 'entity_desc', '在线')
        case '2':
          return utils.FilterFixingLists(source, 'entity_desc', '离线')
      }
    }
  }
  function GetFixingListsPaginationPageSize(urlPageName) {
    switch (urlPageName) {
      case 'index.html':
        return 10
      case '':
        return 10
      default:
        return 6;
    }
  }
  return {
    setFixingIdRedirectUrl,
    GetUrlPageName,
    GetUrlParams,
    SetUrlParams,
    setUrlToTableIndex,
    handleTimeToUnix,
    handleToPad,
    handleToCut,
    handleToYYYYMMDD,
    handleToHHMMSSMS,
    handleTimestampToDate,
    handleTimestampToDateTime,
    SetLoaclStorageUserInfo,
    GetLoaclStorageUserInfo,
    DelLoaclStorageUserInfo,
    GetUserInfo,
    SetUserInfo,
    FilterFixingLists,
    FilterFixingListsSearch,
    FilterFxingListUrl,
    GetFixingListsPaginationPageSize
  }
})()