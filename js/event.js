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

// var Event = (function () {
//   var clientList = [],
//     listen,
//     trigger,
//     remove

//   listen = function (key, fn) {
//     if (!clientList[key]) {
//       clientList[key] = []
//     }
//     clientList[key].push(fn)
//   }
//   trigger = function () {
//     var key = Array.prototype.shift.call(arguments),
//       fns = clientList[key]
//     if (!fns || fns.length === 0) {
//       return false
//     }
//     for (var i = 0, fn; fn = fns[i++];) {
//       fn.apply(null, arguments)
//     }
//   }
//   remove = function (key, fn) {
//     var fns = clientList[key]
//     if (!fns) {
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


var Event = (function () {
  var global = this,
    Event,
    _default = 'default'

  Event = function () {
    var _listen,
      _trigger,
      _remove,
      _slice = Array.prototype.slice,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      find,
      each = function (ary, fn) {
        var ret
        for (var i = 0, l = ary.length; i < l; i++) {
          var n = ary[i]
          ret = fn.call(n, i, n)
        }
        return ret
      }
    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = []
      }
      cache[key].push(fn)
    }
    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1)
            }
          }
        }
      } else {
        cache[key] = []
      }
    }
    _trigger = function () {
      var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _self = this,
        ret,
        stack = cache[key]

      if (!stack || !stack.length) {
        return
      }
      return each(stack, function () {
        return this.apply(_self, args)
      })
    }
    _create = function (namespace) {
      var namespace = namespace || _default
      var cache = {},
        offlineStack = [], // 离线事件堆
        ret = {
          listen: function (key, fn, last) {
            _listen(key, fn, cache)
            if (offlineStack === null) {
              return
            }
            if (last === 'last') {
              offlineStack.length && offlineStack.pop()()
            } else {
              each(offlineStack, function () {
                this()
              })
            }

            offlineStack = null
          },
          one: function (key, fn, last) {
            _remove(key, cache)
            this.listen(key, fn, last)
          },
          remove: function (key, fn) {
            _remove(key, fn)
          },
          trigger: function () {
            var fn,
              args,
              _self = this
            _unshift.call(arguments, cache)
            args = arguments
            fn = function () {
              return _trigger.apply(_self, args)
            }

            if (offlineStack) {
              return offlineStack.push(fn)
            }
            return fn()
          }
        }

      return namespace ?
        (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret) : ret
    }

    return {
      create: _create,
      one: function (key, fn, last) {
        var event = this.create()
        event.one(key, fn, last)
      },
      remove: function (key, fn) {
        var event = this.create()
        event.remove(key, fn)
      },
      listen: function (key, fn, last) {
        var event = this.create()
        event.listen(key, fn, last)
      },
      trigger: function () {
        var event = this.create()
        event.trigger.apply(this, arguments)
      }
    }
  }()

  return Event

})()

// /************** 先发布后订阅 ********************/
// Event.trigger('click', 1);
// Event.listen('click', function (a) {
//   console.log('先发布后订阅------------------------------------');
//   console.log(a);
//   console.log('先发布后订阅------------------------------------');
// });


// /************** 使用命名空间 ********************/
// Event.create('login').trigger('click', 1);
// Event.create('login').listen('click', function (a) {
//   console.log('使用命名空间login------------------------------------');
//   console.log(a);
//   console.log('使用命名空间------------------------------------');
// });
// Event.create('namespace2').listen('click', function (a) {
//   console.log('使用命名空间namespace2------------------------------------');
//   console.log(a);
//   console.log('使用命名空间------------------------------------');
// });
// Event.create('namespace2').trigger('click', 2); 