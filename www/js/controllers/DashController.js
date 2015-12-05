angular.module('dash.controller', ['starter.services'])


.controller('DashCtrl', ["$rootScope", "$scope", "socket", "ngDialog", "_", "$ionicPopup", "$location", 
    function($rootScope, $scope, socket, ngDialog, _, $ionicPopup, $location) {
    $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
    $scope.currentKeypadType = $rootScope.currentKeypadType;
    $scope.maxKeypad = $rootScope.config.keypads.length -1 ;

    var editModeCheck = function (buttons) {
        return _.find(buttons, function(button) {
            return button.name === 'Click to Edit'
        })
    }

    $rootScope.enableEditMode = editModeCheck($scope.keypad.buttons)? true : false;

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
            }]
        })
    };

    // var firstTimeRenameWaring = function() {
    //     ngDialog.open({
    //         template: 'FirstTimeRenameWaring',
    //         closeByDocument: false,
    //         showClose: false,
    //         controller: ['$scope', '$state', 'socket', '$rootScope', function($scope, $state, socket, $rootScope) {
    //             $scope.goToDIY = function() {
    //                 $scope.closeThisDialog();
    //                 firstTimeWaring(firstTimeRenameWaring);
    //             };
    //             $scope.connectWifi = function() {
    //                 $scope.closeThisDialog();
    //                 socket.connect();
    //                 setTimeout(function() {
    //                     if (!$rootScope.WifiConnect) {
    //                         ngDialog.open({
    //                             template: 'WifiWarning'
    //                         })
    //                     }
    //                 }, 1000);
    //             }
    //         }]
    //     })
    // }
    
    var firstTimeRenameWaring = function(){$ionicPopup.show({
        title: 'Editing Buttons&#39 Name',
        subTitle: 'Before you start to edit your button&#39;s name, you must make sure your Powermate has been connected with wifi and other devices only for testing.',
        scope: $scope,
        buttons: [
          { 
            text: '<b>ReConfig</b>',
            onTap: function(){  $location.path('/app/diy'); }
          },
          {
            text: '<b>Ready</b>',
            type: 'button-positive',
            onTap: connectWifi
          }
        ]
    });}
    
    var connectWifi = function() {
        socket.connect();
        setTimeout(function() {
            if (!$rootScope.WifiConnect) {
                ngDialog.open({
                    template: 'WifiWarning'
                })
            }
        }, 1000);
    }

    var finishEditting = function(callback) {
        ngDialog.open({
            template: 'FinishEditting',
            closeByDocument: true,
            showClose: true,
        })
    };

    $scope.addMsg = function(data) {
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
        $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
        $rootScope.enableEditMode = editModeCheck($scope.keypad.buttons)? true : false;

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
        console.log($scope.keypad)
        $rootScope.enableEditMode = editModeCheck($scope.keypad.buttons)? true : false;

    };

    $scope.resetName = function(data){
        var finishEditCheck = _.find($scope.keypad.buttons, function(button) {
            return button.name === 'Click to Edit'
        });
        if (!finishEditCheck) {
            $rootScope.enableEditMode = !$rootScope.enableEditMode;
        } else {
            finishEditting();
        }
    }


    if ( $rootScope.config && $rootScope.config.firstTime && $rootScope.config.firstTime === 'yes' ) {
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

             element.on('click', function() {
                 if ($rootScope.enableEditMode) {
                        ngDialog.open({
                            template: 'buttonsNameTemplate',
                            closeByDocument: false,
                            scope: scope,
                            controller: ['$scope', '$rootScope', '$localstorage',
                                function($scope, $rootScope, $localstorage) {
                                $scope.confirm = function(valName, val) {
                                    scope.info.name = val;

                                    $rootScope.storeKeypads[$rootScope.currentKeypad].buttons
                                        = $rootScope.keypad[$rootScope.currentKeypad].buttons;
                                    $localstorage.setObject('keypads', $rootScope.storeKeypads);
                                    $scope.closeThisDialog();
                                }
                            }]
                        });

                    scope.$apply();
                }
            });

            var onTouch = function() {
                var sendData;
                sendData = keypad.keypadNumberPrefix[0] + scope.info.value.toUpperCase();
                socket.send(sendData);
            };

            var onRelease =  function() {
                var sendData;
                sendData = keypad.keypadNumberPrefix[0] + scope.info.value.toLowerCase();
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
});