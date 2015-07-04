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

.factory('socket', function ($rootScope) {
  var host = '10.10.100.254';
  var port = 8899;

  return {
    connect: function () {
      var socket = new Socket();
      socket.onData = function(data) {
        var result = String.fromCharCode.apply(null, new Uint8Array(data));
        $rootScope.result = result;
        $rootScope.$apply();
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

.factory('socketTest', function ($rootScope) {
  var msgs = ['hello'];
  return function(msg) {
    msgs.push(msg);
    console.log(msgs);
    $rootScope.msgs = msgs;
  }
});
