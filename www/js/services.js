'use strict';
angular.module('starter.services', [])

.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    };
}])

.factory('socket', function($rootScope, keypadSetting, diagnosisSetting, $ionicPopup, keypad) {
    var host = '10.10.100.254';
    var port = 8899;
    var socket;
    return {
        connect: function(disableWarning) {
            disableWarning = disableWarning || false;
            socket = new Socket();
            socket.onData = function(data) {
                if ($rootScope.enableDebug) {
                    diagnosisSetting.debugMsgDisplay(data);
                } else if ($rootScope.enableCopy) {
                    keypadSetting.copyKeypadCheck(data, keypad.keypadNumberPrefix);
                } else {
                    keypadSetting.ledStatusCheck(data);
                }
            };
            socket.onError = function(errorMessage) {
                $rootScope.WifiConnect = false;
                $rootScope.$apply();
                $ionicPopup.alert({
                     title: 'Unable to connect WIFI',
                     template: 'Please check your WIFI device'
                });
                // invoked after error occurs during connection
            };
            socket.onClose = function(hasError) {
                $rootScope.WifiConnect = false;
                $rootScope.$apply();
                // invoked after connection close
            };
            socket.open(
                host,
                port,
                function() {
                    $rootScope.WifiConnect = true;
                    if (!disableWarning) {
                        $ionicPopup.alert({
                             title: 'Wifi Connect',
                             template: 'Your app has been connected successfully'
                        });
                    }
                    $rootScope.$apply();
                    // invoked after successful opening of socket
                },
                function(errorMessage) {
                    // $ionicPopup.alert({
                    //      title: 'Unable to connect WIFI',
                    //      template: 'Please check your WIFI device'
                    // });
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
        sendHex: function(hexArray) {
            socket.write(hexArray);
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
        $rootScope.msgs = msgs;
    };
})


.factory('diagnosisSetting', function($rootScope) {
    var debugMsg = [""];
    var hexToString = function(data) {
        var resultConvert = [];
        var result = new Uint8Array(data);
        for (var index in result) {
            resultConvert[index] = String.fromCharCode(result[index]);
        }
        return resultConvert.join('');
    }
    return {
        "debugMsg": debugMsg,
        "debugMsgDisplay": function(res) {
             $rootScope.debugMsg[0] += hexToString(res) + "\n";
             $rootScope.$apply();
        },

        "initialize": function() {
            $rootScope.debugMsg = [""];
        }


    };
})

.factory('keypadSetting', function($rootScope, keypad) {
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
            '4r': [{
                name: "Click to Edit", value: "a", led: [0x01]
            }, {
                name: "Click to Edit", value: "b", led: [0x02]
            }, {
                name: "Click to Edit", value: "c", led: [0x03]
            }, {
                name: "Click to Edit", value: "d", led: [0x04]
            }],
            '8r': [{
                name: "Click to Edit", value: "a", led: [0x01, 0x09]
            }, {
                name: "Click to Edit",value: "b",led: [0x02, 0x0A]
            }, {
                name: "Click to Edit",value: "c",led: [0x03, 0x0B]
            }, {
                name: "Click to Edit",value: "d",led: [0x04, 0x0C]
            }, {
                name: "Click to Edit",value: "e",led: [0x05, 0x0D]
            }, {
                name: "Click to Edit",value: "f",led: [0x06, 0x0E]
            }, {
                name: "Click to Edit",value: "g",led: [0x07, 0x0F]
            }, {
                name: "Click to Edit",value: "h",led: [0x08, 0x10]
            }],
            '10b': [{
                name: "Click to Edit",value: "a",led: [0x11, 0x12, 0x13],bgLocation: { "background-image": "url('./img/png_4_keypads/battery.png')"}
            }, {
                name: "Click to Edit",value: "b",led: [0x14, 0x15, 0x16],bgLocation: { "background-image": "url('./img/png_4_keypads/beacon.png')"}
            }, {
                name: "Click to Edit",value: "c",led: [0x17, 0x18, 0x19],bgLocation: { "background-image": "url('./img/png_4_keypads/gear.png')"}
            }, {
                name: "Click to Edit",value: "d",led: [0x1A, 0x1B, 0x1C],bgLocation: { "background-image": "url('./img/png_4_keypads/hori_light.png')"}
            }, {
                name: "Click to Edit",value: "e",led: [0x05, 0x06, 0x07],bgLocation: { "background-image": "url('./img/png_4_keypads/key.png')"}
            }, {
                name: "Click to Edit",value: "f",led: [0x08, 0x09, 0x0A],bgLocation: { "background-image": "url('./img/png_4_keypads/light.png')"}
            }, {
                name: "Click to Edit",value: "g",led: [0x0B, 0x0C, 0x0D],bgLocation: { "background-image": "url('./img/png_4_keypads/lock.png')"}
            }, {
                name: "Click to Edit",value: "h",led: [0x0E, 0x0F, 0x10],bgLocation: { "background-image": "url('./img/png_4_keypads/skeleton.png')"}
            }, {
                name: "Click to Edit",value: "i",led: [0x03, 0x04],bgLocation: { "background-image": "url('./img/png_4_keypads/truck_with_box.png')"}
            }, {
                name: "Click to Edit",value: "j",led: [0x1D, 0x1E],bgLocation: { "background-image": "url('./img/png_4_keypads/truck_with_leg.png')"}
            }],
            '12b': [{
                name: "Click to Edit",value: "a",led: [0x01, 0x0D]
            }, {
                name: "Click to Edit",value: "b",led: [0x02, 0x0E]
            }, {
                name: "Click to Edit",value: "c",led: [0x03, 0x0F]
            }, {
                name: "Click to Edit",value: "d",led: [0x04, 0x10]
            }, {
                name: "Click to Edit",value: "e",led: [0x05, 0x11]
            }, {
                name: "Click to Edit",value: "f",led: [0x06, 0x12]
            }, {
                name: "Click to Edit",value: "g",led: [0x07, 0x13]
            }, {
                name: "Click to Edit",value: "h",led: [0x08, 0x14]
            }, {
                name: "Click to Edit",value: "i",led: [0x09, 0x15]
            }, {
                name: "Click to Edit",value: "j",led: [0x0A, 0x16]
            }, {
                name: "Click to Edit",value: "k",led: [0x0B, 0x17]
            }, {
                name: "Click to Edit",value: "l",led: [0x0C, 0x18]
            }],
            '14b': [{
                name: "Click to Edit",value: "a",led: [0x04, 0x05, 0x06]
            }, {
                name: "Click to Edit",value: "b",led: [0x07, 0x08, 0x09]
            }, {
                name: "Click to Edit",value: "c",led: [0x0A, 0x0B, 0x0C]
            }, {
                name: "Click to Edit",value: "d",led: [0x0D, 0x0E, 0x0F]
            }, {
                name: "Click to Edit",value: "e",led: [0x10, 0x11, 0x12]
            }, {
                name: "Click to Edit",value: "f",led: [0x13, 0x14, 0x15]
            }, {
                name: "Click to Edit",value: "g",led: [0x18, 0x19, 0x1A]
            }, {
                name: "Click to Edit",value: "h",led: [0x1B, 0x1C, 0x1D]
            }, {
                name: "Click to Edit",value: "i",led: [0x1E, 0x1F, 0x20]
            }, {
                name: "Click to Edit",value: "j",led: [0x21, 0x22, 0x23]
            }, {
                name: "Click to Edit",value: "k",led: [0x24, 0x25, 0x26]
            }, {
                name: "Click to Edit",value: "l",led: [0x27, 0x28, 0x29]
            }, {
                name: "Click to Edit",value: "m",led: [0x03, 0x17]
            }, {
                name: "Click to Edit",value: "n",led: [0x16, 0x2A]
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
    };

    return {
        keypads: keypads,
        buttons: buttons,

        initialize: function(keypadConfigs) {
            var self = this;
            keypadConfigs.forEach(function(keypadConfig, i) {
                var keypadNumber = keypad.keypadNumberPrefix.indexOf(keypadConfig.prefix);
                keypadsConst[keypadNumber].type = keypadConfig.type;
                self.keypads[i] = keypadsConst[keypadNumber];
            });
        },

        ledStatusCheck: function(res) {
            var result = hexToString(res);

            this.keypads.forEach(function(kd, index) {
                buttons[kd.type].forEach(function(button, buttonIndex) {
                    button.led.forEach(function(led, ledIndex){
                        for(var status in ledStatus) {
                            var tmp = new Uint8Array([kd.prefix, ledPrefix, led, ledStatus[status]]);
                            var ledStatusCheckString = hexToString(tmp);
                            if ( result.match(ledStatusCheckString) ) {
                                $rootScope.keypad[index].buttons[buttonIndex].led[ledIndex] = status;
                                $rootScope.$apply();
                            }
                        }
                    });
                });
            });
        },

        copyKeypadCheck: function(res, keypadsPrefix) {
            var result =  String.fromCharCode.apply(null, new Uint8Array(res));
            keypadsPrefix.forEach(function (prefix, index) {
                var regex = new RegExp('\\' + prefix);
                if (result.match(regex)) {
                    $rootScope.copyKeypad[0] = $rootScope.copyKeypad[0] || index + 1;
                }
            });
            $rootScope.$apply();
        }
    };
})

.factory('keypad', function() {
    return {
        keypadNumberPrefix: ["!", "\"", "#", "$", "%", "&",
            "'", "(", ")", "*"
        ]
    };
});
