'use strict';
angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('socket', function ($rootScope, tenKeypad) {
  var host = '10.10.100.254';
  var port = 8899;

  return {
    connect: function () {
      var socket = new Socket();
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
      var dataString = "Hello world";
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
        $rootScope.apply();
      })

    }
  };
});
