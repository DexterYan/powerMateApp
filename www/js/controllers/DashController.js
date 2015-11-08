angular.module('dash.controller', ['starter.services'])


.controller('DashCtrl', ["$rootScope", "$scope", "socket", "ngDialog", function($rootScope, $scope, socket, ngDialog) {
    var _ = $rootScope._;
    $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
    $scope.currentKeypadType = $rootScope.currentKeypadType;
    $scope.maxKeypad = $rootScope.config.keypads.length -1 ;
    var editModeCheck = $rootScope._.find($scope.keypad.buttons, function(button) {
        return button.name === 'Click to Edit'
    });
    $rootScope.enableEditMode = editModeCheck? true : false;

    var firstTimeWaring = function(callback) {
        ngDialog.open({
            template: 'FirstTimeWarning',
            closeByDocument: false,
            showClose: false,
            controller: ['$scope', '$state', function($scope, $state) {
                $scope.nameButton = function() {
                    $scope.closeThisDialog();
                    callback();
                };
                $scope.goToDIY = function() {
                    $scope.closeThisDialog();
                    $state.go('app.diy');
                };
            }]
        })
    };

    var firstTimeRenameWaring = function() {
        ngDialog.open({
            template: 'FirstTimeRenameWaring',
            closeByDocument: false,
            showClose: false,
            controller: ['$scope', '$state', 'socket', '$rootScope', function($scope, $state, socket, $rootScope) {
                $scope.goToDIY = function() {
                    $scope.closeThisDialog();
                    firstTimeWaring(firstTimeRenameWaring);
                };
                $scope.connectWifi = function() {
                    $rootScope.WifiConnect = true;
                    $scope.closeThisDialog();
                    socket.connect();
                }
            }]
        })
    }

    $scope.addMsg = function(data) {
        $rootScope.WifiConnect = true;
        socket.connect();
    };

    $scope.previousKeypad = function() {
        var maxKeypad = $rootScope.config.keypads.length - 1;
        if ($rootScope.currentKeypad === 0) {
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
        $rootScope.enableEditMode = !$rootScope.enableEditMode;
        console.log($rootScope.enableEditMode)
    }

    if ( $rootScope.config && _.isEmpty($rootScope.config.keypads) ) {
        firstTimeWaring(firstTimeRenameWaring);
    } else if ($rootScope.enableEditMode) {
        firstTimeRenameWaring();
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
.directive('keypadButton', function(keypad, socket, $ionicScrollDelegate, ngDialog, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'templates/elements/button.html',
        scope: {
            info: '='
        },
        link: function(scope, element, attrs) {
            console.log($rootScope.enableEditMode)

             element.on('click', function() {
                 if ($rootScope.enableEditMode) {
                    scope.info.led[0] = scope.info.led[0]=='on'?'off':'on';
                        ngDialog.open({
                            template: 'buttonsNameTemplate',
                            closeByDocument: false,
                            scope: scope,
                            controller: ['$scope', '$rootScope', '$localstorage',
                                function($scope, $rootScope, $localstorage) {
                                $scope.confirm = function(valName, val) {
                                    scope.info.name = val;
                                    console.log($rootScope.keypad);
                                    $rootScope.storeKeypads[$rootScope.currentKeypad].buttons
                                        = $rootScope.keypad[$rootScope.currentKeypad].buttons;
                                    console.log($rootScope.storeKeypads);

                                    $localstorage.setObject('keypads', $rootScope.storeKeypads);
                                    $scope.closeThisDialog();
                                }
                            }]
                        });

                    scope.$apply();
                }
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