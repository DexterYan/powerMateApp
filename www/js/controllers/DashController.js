angular.module('dash.controller', ['starter.services'])


.controller('DashCtrl', function($rootScope, $scope, socket) {
    if ( $rootScope.currentKeypadType === '10b') {
        $scope.tenKeypad = $rootScope.keypad[$rootScope.currentKeypad];
    }
    $scope.addMsg = function(data) {
        socket.connect()
    }
})

.directive('keypadButton', ['keypad', 'socket', '$ionicScrollDelegate', 
    function(keypad, socket, $ionicScrollDelegate) {
        return {
            restrict: 'E',
            templateUrl: 'templates/elements/button.html',
            scope: {
                info: '='
            },
            link: function(scope, element, attrs) {
                // element.on('click', function() {
                //     scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
                //     scope.$apply();
                // };

                var onTouch = function() {
                    var sendData;
                    sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toUpperCase();
                    socket.send(sendData);
                };

                var onRelease =  function() {
                    var sendData;
                    sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toLowerCase();
                   socket.send(sendData);
                };
                
                element.on('touchstart', function() {
                    scope.$apply(function() {
                        scope.$eval(onTouch);
                    });
                });

                element.on('touchend', function() {
                    scope.$apply(function() {
                        scope.$eval(onRelease);
                    });
                });
            }
        }
    }
]);