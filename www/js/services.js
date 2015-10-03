'use strict';
angular.module('starter.services', [])


.factory('socket', function($rootScope, keypadSetting) {
    var host = '10.10.100.254';
    var port = 8899;
    var socket;
    return {
        connect: function() {
            socket = new Socket();
            socket.onData = function(data) {
                var result = String.fromCharCode.apply(null, new Uint8Array(data));
                keypadSetting.ledStatusCheck(data);
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
        send: function(dataString) {
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


.factory('socketTest', function($rootScope, keypadSetting) {
    var msgs = ['hello'];
    return function(msg) {
        msgs.push(keypadSetting.ledStatusCheck());
        console.log(msgs);
        $rootScope.msgs = msgs;
    }
})

.factory('keypadSetting', function($rootScope) {
    var ledStatus = {
            on: 0x01,
            off: 0x00,
            blink: 0x02
        },
        keypadsConst = [
            {type:'', prefix: '0x31'}, {type:'', prefix: '0x32'}, {type:'', prefix: '0x33'}, {type:'', prefix: '0x34'},
            {type:'', prefix: '0x35'}, {type:'', prefix: '0x36'}, {type:'', prefix: '0x37'}, {type:'', prefix: '0x38'},
            {type:'', prefix: '0x39'}, {type:'', prefix: '0x3A'}, {type:'', prefix: '0x3B'}, {type:'', prefix: '0x3C'},
            {type:'', prefix: '0x3D'}, {type:'', prefix: '0x3E'}, {type:'', prefix: '0x3F'}
        ],
        ledPrefix = 0x80,
        buttons = {
            '10b': [{
                    name: "a",
                    led: [0x11, 0x12, 0x13]
                }, {
                    name: "b",
                    led: [0x14, 0x15, 0x16]
                }, {
                    name: "c",
                    led: [0x17, 0x18, 0x19]
                }, {
                    name: "d",
                    led: [0x1A, 0x1B, 0x1C]
                }, {
                    name: "e",
                    led: [0x05, 0x06, 0x07]
                }, {
                    name: "f",
                    led: [0x08, 0x09, 0x0A]
                }, {
                    name: "g",
                    led: [0x0B, 0x0C, 0x0D]
                }, {
                    name: "h",
                    led: [0x0E, 0x0F, 0x10]
                }, {
                    name: "i",
                    led: [0x03, 0x04]
                }, {
                    name: "j",
                    led: [0x1D, 0x1E]
                }],
            '14b': [{
                    name: "a",
                    led: [0x11, 0x12, 0x13]
                }, {
                    name: "b",
                    led: [0x14, 0x15, 0x16]
                }, {
                    name: "c",
                    led: [0x17, 0x18, 0x19]
                }, {
                    name: "d",
                    led: [0x1A, 0x1B, 0x1C]
                }, {
                    name: "e",
                    led: [0x05, 0x06, 0x07]
                }, {
                    name: "f",
                    led: [0x08, 0x09, 0x0A]
                }, {
                    name: "g",
                    led: [0x0B, 0x0C, 0x0D]
                }, {
                    name: "h",
                    led: [0x0E, 0x0F, 0x10]
                }, {
                    name: "i",
                    led: [0x03, 0x04]
                }, {
                    name: "j",
                    led: [0x1D, 0x1E]
                }]
        };


    var keypads = [keypadsConst[0]];

    var hexToString = function(data) {
        var resultConvert = [];
        var result = new Uint8Array(data);
        for (var index in result) {
            resultConvert[index] = result[index].toString();
        }
        return resultConvert.join();
    }
    return {
        keypads: keypads,
        buttons: buttons,

        initialize: function(keypadConfigs) {
            keypadConfigs.forEach(function(keypadConfig, i) {
                keypadsConst[i].type = keypadConfig.type;
                keypads[i] = keypadsConst[i];
            });
        },

        ledStatusCheck: function(res) {
            var result = hexToString(res);

            keypads.forEach(function(keypad, index) {
                buttons[keypad.type].forEach(function(button, buttonIndex) {
                    button.led.forEach(function(led, ledIndex){
                        for(var status in ledStatus) {
                            var tmp = new Uint8Array([keypad.prefix, ledPrefix, led, ledStatus[status]])
                            var ledStatusCheckString = hexToString(tmp);
                            if ( result.match(ledStatusCheckString) ) {
                                $rootScope.keypad[index].buttons[buttonIndex].led[ledIndex] = status;
                                $rootScope.$apply();
                            }
                        }
                    })
                })
            });
        }
    };
})

.factory('keypad', function() {
    return {
        keypadNumberPrefix: ["!", "\"", "#", "$", "%", "&",
            "'", "(", ")", "*", "+", ",", "-", ".", "/"
        ]
    }
});