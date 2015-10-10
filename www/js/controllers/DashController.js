angular.module('dash.controller', ['starter.services'])


.controller('DashCtrl', ["$rootScope", "$scope", "socket", function($rootScope, $scope, socket) {
    $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
    $scope.currentKeypadType = $rootScope.currentKeypadType;
    $scope.maxKeypad = $rootScope.config.keypads.length;
    console.log($scope.maxKeypad);
    
    $scope.addMsg = function(data) {
        socket.connect()
    };

    $scope.previousKeypad = function() {
        var maxKeypad = $rootScope.config.keypads.length - 1;
        if ($rootScope.currentKeypad ===0) {
            $rootScope.currentKeypad = maxKeypad;
        } else {
            $rootScope.currentKeypad--;
        }
        $rootScope.currentKeypadType = $rootScope.config.keypads[$rootScope.currentKeypad].type;
        $scope.currentKeypadType = $rootScope.currentKeypadType;
        console.log($scope.currentKeypadType);
        $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
    };
    $scope.nextKeypad = function() {
        console.log($rootScope.config.keypads);
        var maxKeypad = $rootScope.config.keypads.length - 1;
        console.log(maxKeypad);
        if ($rootScope.currentKeypad === maxKeypad) {
            $rootScope.currentKeypad = 0;
        } else {
            $rootScope.currentKeypad++;
        }
        $rootScope.currentKeypadType = $rootScope.config.keypads[$rootScope.currentKeypad].type;
        $scope.currentKeypadType = $rootScope.currentKeypadType;
        $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
        console.log($scope.currentKeypadType);
    };
    
    $scope.resetName = function(data){
        
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
        templateUrl: 'templates/elements/forteenButtonKeypad.html',
        scope: {
            keypad: '='
        }
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