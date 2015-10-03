angular.module('dash.controller', ['starter.services'])


.controller('DashCtrl', ["$rootScope", "$scope", "socket", function($rootScope, $scope, socket) {
    if ( $rootScope.currentKeypadType === '10b') {
        $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
    }
    $scope.addMsg = function(data) {
        socket.connect()
    }
}])
.directive('fourButtonKeypad', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/elements/fourButtonKeypad.html'
    }
})
.directive('eightButtonKeypad', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/elements/eightButtonKeypad.html'
    }
})
.directive('tenButtonKeypad', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/elements/tenButtonKeypad.html'
    }
})
.directive('forteenButtonKeypad', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/elements/forteenButtonKeypad.html'
    }
})
.directive('keypadButton', function(keypad, socket, $ionicScrollDelegate) {
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

            // var onTouch = function() {
            //     var sendData;
            //     sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toUpperCase();
            //     socket.send(sendData);
            // };

            // var onRelease =  function() {
            //     var sendData;
            //     sendData = keypad.keypadNumberPrefix[0] + scope.info.name.toLowerCase();
            //   socket.send(sendData);
            // };
            
            // element.on('touchstart', function() {
            //     scope.$apply(function() {
            //         scope.$eval(onTouch);
            //     });
            // });

            // element.on('touchend', function() {
            //     scope.$apply(function() {
            //         scope.$eval(onRelease);
            //     });
            // });
        }
    }
});