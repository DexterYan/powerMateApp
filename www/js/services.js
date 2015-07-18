'use strict';
angular.module('starter.services', [])


.factory('socket', function ($rootScope, tenKeypad) {
  var host = '10.10.100.254';
  var port = 8899;
  var socket;
  return {
    connect: function () {
      socket = new Socket();
      socket.onData = function(data) {
        var result = String.fromCharCode.apply(null, new Uint8Array(data));
        tenKeypad.ledStatusCheck(data);
      };
      socket.onError = function(errorMessage) {
        // invoked after error occurs during connection
      };
      socket.onClose = function(hasError) {
        // invoked after connection close
      };
      socket.open(
      host,
      port,
      function() {
        $rootScope.isConnected = true;
        $rootScope.$apply();
        // invoked after successful opening of socket
      },
      function(errorMessage) {
        alert(errorMessage);
        // invoked after unsuccessful opening of socket
      });
    },
    send: function (dataString) {
      var data = new Uint8Array(dataString.length);
      for (var i = 0; i < data.length; i++) {
        data[i] = dataString.charCodeAt(i);
      }
      socket.write(data);
    },
    close: function() {
      socket.shutdownWrite();
    }
  };
})


.factory('socketTest', function ($rootScope, tenKeypad) {
  var msgs = ['hello'];
  return function(msg) {
    msgs.push(tenKeypad.ledStatusCheck());
    console.log(msgs);
    $rootScope.msgs = msgs;
  }
})

.factory('tenKeypad', function($rootScope) {
  var ledStatus= {on: 0x01, off: 0x00, blink: 0x02},
  ledKeypadNumber= [0x31, 0x32, 0x33, 0x34,
    0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C,
    0x3D, 0x3E, 0x3F],
  ledPrefix= 0x80,
  led= {
          a: [0x11, 0x12, 0x13], b: [0x14, 0x15, 0x16], c: [0x17, 0x18, 0x19],
          d: [0x1A, 0x1B, 0x1C], e: [0x05, 0x06, 0x07], f: [0x08, 0x09, 0x0A],
          g: [0x0B, 0x0C, 0x0D], h: [0x0E, 0x0F, 0x10], i: [0x03, 0x04],
          j: [0x1D, 0x1E]

  };
  var hexToString = function(data) {
    var resultConvert = [];
    var result = new Uint8Array(data);
    for (var index in result) {
      resultConvert[index] = result[index].toString();
    }
    return resultConvert.join();
  }
  return {
    ledStatusCheck: function(res) {
      var result = hexToString(res);
      ledKeypadNumber.forEach(function(keypad, index) {
        for (var ledTypes in led) {
          led[ledTypes].forEach(function(ledType, ledIndex) {
            for(var status in ledStatus) {
              var tmp = new Uint8Array([keypad, ledPrefix, ledType, ledStatus[status]]);
              var ledStatusCheckString = hexToString(tmp);
              if (result.match(ledStatusCheckString)) {
                $rootScope.keypad[index].led[ledTypes+ledIndex] = status;
              }
            }
          })
        }
      })
      $rootScope.$apply();
    }
  };
});
