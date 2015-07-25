angular.module('starter.controllers', ['starter.services'])


.controller('DashCtrl', function($scope, socket) {
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
                scope.color1 = attrs.color1;
                
                element.on('click', function() {
                    var sendData;
                    sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toUpperCase();
                    socket.send(sendData);
                });

                element.on('release', function() {
                    sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toLowerCase();
                    socket.send(sendData);
                });
                
                
                
                scope.color = function(state){
                  console.log(attrs.color2);
                  if (state == 'on') 
                    return attrs.color2;
                  else if (state == 'off') 
                    return attrs.color1;
                }
            }
        }
    }
]);