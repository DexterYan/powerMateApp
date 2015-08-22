angular.module('dash.controller', ['starter.services'])


.controller('DashCtrl', function($rootScope, $scope, socket) {
    $scope.addMsg = function(data) {
        socket.connect()
    }
})

.directive('keypadButton', ['keypad', 'socket',
    function(keypad, socket) {
        return {
            restrict: 'E',
            templateUrl: 'templates/elements/button.html',
            scope: {
                info: '='
            },
            link: function(scope, element, attrs) {
                
                element.on('click', function() {
                    scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
                    scope.$apply();
                });
                
                // element.on('click', function() {
                //     var sendData;
                //     sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toUpperCase();
                //     socket.send(sendData);
                // });

                // element.on('release', function() {
                //     sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toLowerCase();
                //     socket.send(sendData);
                // });
            }
        }
    }
]);