// var event = (function () {
//   var clientList = []

//   function listen (key, fn) {
//     if (!clientList[key]) {
//       clientList[key] = []
//     }
//     clientList[key].push(fn)
//   }
//   function trigger () {
//     var key = Array.prototype.shift.call(arguments),
//       fns = clientList[key]
//     if(!fns || fns.length === 0) {
//       return false
//     }
//     for(var i = 0, fn; fn = fns[i++];) {
//       fn.apply(null, arguments)
//     }
//   }
//   function remove (key, fn) {
//     var fns = clientList[key]
//     if (!fns)  {
//       return false
//     }
//     if (!fns) {
//       fns && (fns.length = 0)
//     } else {
//       for (var len = fns.length - 1; len >= 0; len--) {
//         var _fn = fns[len]
//         if (_fn === fn) {
//           fns.splice(len, 1)
//         }
//       }
//     }
//   }
//   return {
//     listen,
//     trigger,
//     remove
//   }
// }())

// 订阅/发布
// var events = {
//   clientList: [],

//   listen (key, fn) {
//     if (!clientList[key]) {
//       clientList[key] = []
//     }
//     clientList[key].push(fn)
//   },
//   trigger () {
//     var key = Array.prototype.shift.call(arguments),
//       fns = clientList[key]
//     if(!fns || fns.length === 0) {
//       return false
//     }
//     for(var i = 0, fn; fn = fns[i++];) {
//       fn.apply(null, arguments)
//     }
//   },
//   remove (key, fn) {
//     var fns = clientList[key]
//     if (!fns)  {
//       return false
//     }
//     if (!fns) {
//       fns && (fns.length = 0)
//     } else {
//       for (var len = fns.length - 1; len >= 0; len--) {
//         var _fn = fns[len]
//         if (_fn === fn) {
//           fns.splice(len, 1)
//         }
//       }
//     }
//   }
// }

var Event = (function () {
  var clientList = [],
    listen,
    trigger,
    remove

  listen = function (key, fn) {
    if (!clientList[key]) {
      clientList[key] = []
    }
    clientList[key].push(fn)
  }
  trigger = function () {
    var key = Array.prototype.shift.call(arguments),
      fns = clientList[key]
    if (!fns || fns.length === 0) {
      return false
    }
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(null, arguments)
    }
  }
  remove = function (key, fn) {
    var fns = clientList[key]
    if (!fns) {
      return false
    }
    if (!fns) {
      fns && (fns.length = 0)
    } else {
      for (var len = fns.length - 1; len >= 0; len--) {
        var _fn = fns[len]
        if (_fn === fn) {
          fns.splice(len, 1)
        }
      }
    }
  }

  return {
    listen,
    trigger,
    remove
  }
}())