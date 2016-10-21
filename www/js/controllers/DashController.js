angular.module("dash.controller", ["starter.services", "ionic"])


.controller("DashCtrl", function($rootScope, $scope, socket, ngDialog, _, $ionicPopup, $location, $cordovaFile) {
    $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
    $scope.currentKeypadType = $rootScope.currentKeypadType;
    $scope.maxKeypad = $rootScope.config.keypads.length -1;



    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {

        if (/2$/.test($scope.currentKeypadType)) {
            window.screen.lockOrientation("landscape");
            $scope.customKeypad = true;
        } else {
            $scope.customKeypad = false;
        }

        ionic.Platform.ready(function() {
            // $cordovaStatusbar.hide();
            if ( $rootScope.config && $rootScope.config.firstTime && $rootScope.config.firstTime === "yes" ) {
                firstTimeWaring(firstTimeRenameWaring);
            } else if ($rootScope.enableEditMode) {
                firstTimeRenameWaring();
            }
            ionic.Platform.fullScreen();
        });
    }

    var editModeCheck = function (buttons) {
        return _.find(buttons, function(button) {
            return button.name === "Click to Edit";
        });
    };

    $rootScope.enableEditMode = editModeCheck($scope.keypad.buttons)? true : false;

    var firstTimeWaring = function(callback) {
        ngDialog.open({
            template: "FirstTimeWarning",
            closeByDocument: false,
            showClose: false,
            controller: ["$scope", "$state", function($scope, $state) {
                $scope.nameButton = function() {
                    $scope.closeThisDialog();
                    callback();
                };
            }]
        });
    };

    var firstTimeRenameWaring = function(){
        ngDialog.open({
            template: "FirstTimeRenameWaring",
            closeByDocument: false,
            showClose: false,
            controller: ["$scope", "$state", "socket", "$rootScope", function($scope, $state, socket, $rootScope) {
                $scope.goToDIY = function() {
                    $scope.closeThisDialog();
                    firstTimeWaring(firstTimeRenameWaring);
                };
                $scope.connectWifi = function() {
                    $scope.closeThisDialog();
                    socket.connect();
                    setTimeout(function() {
                        if (!$rootScope.WifiConnect) {
                            ngDialog.open({
                                template: "WifiWarning"
                            });
                        }
                    }, 1000);
                };
            }]
        });
    };

    var connectWifi = function() {
        //socket.connect();
        setTimeout(function() {
            if (!$rootScope.WifiConnect) {
                ngDialog.open({
                    template: "WifiWarning"
                });
            }
        }, 1000);
    };

    var finishEditting = function(callback) {
        ngDialog.open({
            template: "FinishEditting",
            closeByDocument: true,
            showClose: true,
        });
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
        var maxKeypad = $rootScope.config.keypads.length - 1;
        if ($rootScope.currentKeypad === maxKeypad) {
            $rootScope.currentKeypad = 0;
        } else {
            $rootScope.currentKeypad++;
        }
        $rootScope.currentKeypadType = $rootScope.config.keypads[$rootScope.currentKeypad].type;
        $scope.currentKeypadType = $rootScope.currentKeypadType;
        $scope.keypad = $rootScope.keypad[$rootScope.currentKeypad];
        $rootScope.enableEditMode = editModeCheck($scope.keypad.buttons)? true : false;

    };

    $scope.resetName = function(data){
        var finishEditCheck = _.find($scope.keypad.buttons, function(button) {
            return button.name === "Click to Edit";
        });
        if (!finishEditCheck) {
            $rootScope.enableEditMode = !$rootScope.enableEditMode;
        } else {
            finishEditting();
        }
    };

})
.directive("landscapeTenButtonKeypad", function(){
    return {
        restrict: "E",
        templateUrl: "templates/elements/landscapeTenButtonKeypad.html"
    };
})
.directive("landscapeFourButtonKeypad", function(){
    return {
        restrict: "E",
        templateUrl: "templates/elements/landscapeFourButtonKeypad.html"
    };
})
.directive("landscapeEightButtonKeypad", function(){
    return {
        restrict: "E",
        templateUrl: "templates/elements/landscapeEightButtonKeypad.html"
    };
})
.directive("landscapeForteenButtonKeypad", function(){
    return {
        restrict: "E",
        templateUrl: "templates/elements/landscapeForteenButtonKeypad.html"
    };
})
.directive("keypadButton", function(keypad, socket, $ionicScrollDelegate, $ionicPopup, $rootScope, $localstorage, $timeout, $cordovaFile) {
    return {
        restrict: "E",
        templateUrl: "templates/elements/button.html",
        scope: {
            prefix: "=",
            info: "="
        },
        link: function(scope, element, attrs) {

            var renameProcess = function(res) {
                scope.data.buttonsName = res;
                scope.info.name = scope.data.buttonsName;

                window.imagePicker.getPictures(function(results) {
                    if (results.length >= 1) {
                        filename = results[0].replace(cordova.file.applicationStorageDirectory + "tmp/", "");
                        newFileName = Math.random().toString(36).substr(2, 5) + filename;
                        $cordovaFile.moveFile(cordova.file.applicationStorageDirectory, "tmp/" + filename, cordova.file.dataDirectory, newFileName)
                        .then(function (success) {
                            v = "url('"+ success.nativeURL + "')";
                            scope.info.bgLocation["background-image"] = v;
                            scope.$apply();
                            $rootScope.storeKeypads[$rootScope.currentKeypad].buttons =
                            $rootScope.keypad[$rootScope.currentKeypad].buttons;
                            $localstorage.setObject("keypads", $rootScope.storeKeypads);
                        }, function (error) {});
                    } else {
                        $rootScope.storeKeypads[$rootScope.currentKeypad].buttons =
                        $rootScope.keypad[$rootScope.currentKeypad].buttons;
                        $localstorage.setObject("keypads", $rootScope.storeKeypads);
                    }
                }, function (error) {
                    console.log('Error: ' + error);
                }, {
                    maximumImagesCount: 1
                });
            };

            element.on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();

                if ($rootScope.enableEditMode) {
                    scope.data = {};

                    $timeout(function(){
                        $ionicPopup.prompt({
                            "title": "Rename this button:"
                        })
                        .then(function(res){
                            if (res) {
                                renameProcess(res);
                            }
                        });
                    }, 500);
                }
            });

            var onTouch = function() {
                var sendData;
                sendData = scope.prefix+ scope.info.value.toUpperCase();
                socket.send(sendData);
            };

            var onRelease =  function() {
                var sendData;
                sendData = scope.prefix + scope.info.value.toLowerCase();
                socket.send(sendData);
            };

            element.on("touchstart", function() {
                scope.$apply(function() {
                    scope.$eval(onTouch);
                });
            });

            element.on("touchend", function() {
                scope.$apply(function() {
                    scope.$eval(onRelease);
                });
            });
        }
    };
});
