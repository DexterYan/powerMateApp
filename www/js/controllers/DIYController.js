angular.module('diy.controller', ['starter.services'])

.controller('DIYCtrl', function($scope, $ionicTabsDelegate, ngDialog, $rootScope, $localstorage, $state, $ionicPopup, socket, keypad) {
     var keypadName = ['First', 'Second', 'Third', 'Fourth',
                                        'Fifth', 'Sixth', 'Seventh', 'Eighth'];
    $scope.keypadsTypes = [];

    $scope.configStepOne = function() {
       $scope.data = {}
        var howManyButtonPopup = $ionicPopup.show({
            template: '<select ng-model="data.totalKeypad">' +
                '<option value=1>1</option><option value=2>2</option>' +
                '<option value=3>3</option><option value=4>4</option>' +
                '<option value=5>5</option><option value=6>6</option>' +
                '<option value=7>7</option><option value=8>8</option>' +
                '<option value=9>9</option><option value=10>10</option></select>',
            title: 'How many keypads do you need?',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.totalKeypad) {
                        //don't allow the user to close unless
                            e.preventDefault();
                        } else {
                            return $scope.data.totalKeypad;
                        }
                    }
                }
            ]
        });

        howManyButtonPopup.then(function(res) {
            if (res) {
                $rootScope.config ={};
                $rootScope.config.keypads = [];
                $scope.keypadsTypes = [];
                howManyButtonPopup.close();
                $scope.configWifiWarning();
            }
        });
    };

    $scope.configWifiWarning = function () {
            var wifiWarningPopup = $ionicPopup.show({
                template: '<div>Before you start to copy your keypad, ' +
                    'you must make sure WiFi and keypads have been ' +
                    'connected with your Powermate</div>',
                title: 'Warning',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Ready</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            $rootScope.enableCopy = true;
                            socket.connect(true);
                            $scope.configCopyButton(0);
                            return null;
                        }
                    }
                ]
            });
    };

    $scope.configCopyButton = function(keypadNumber) {
        var keypadNumberTmp = keypadNumber;

        if (keypadNumber < $scope.data.totalKeypad) {
            var copyIndicatorPopup = $ionicPopup.show({
                template: '<div>Please press any button in your ' +
                    keypadName[keypadNumberTmp].toLowerCase()  + ' keypad</div>',
                title: 'Copy ' + keypadName[keypadNumberTmp] + ' Keypad Type',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>Pressed</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$rootScope.copyKeypad) {
                                e.preventDefault();
                            } else {
                                $rootScope.enableCopy = false;
                                return $rootScope.copyKeypad;
                            }
                        }
                    }
                ]
            })
                .then(function(copyKeypadNumber) {
                    var myPopup = $ionicPopup.show({
                        template:
                            '<div>This keypad is ' + copyKeypadNumber +
                            '. Please choose this keypad style</div>' +
                            '<select ng-model="data.keypadType">' +
                            '<option value="4r">4 Round Buttons Keypad</option>' +
                            '<option value="8r">8 Round Buttons Keypad</option>' +
                            '<option value="10b"> 10 Unround Buttons Keypad</option>' +
                            '<option value="14b"> 14 Unround Buttons Keypad</option></select>',
                        title: 'Set ' + keypadName[keypadNumberTmp] + ' Keypad Type',
                        scope: $scope,
                        buttons: [
                            {
                                text: '<b>Save</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (!$scope.data.keypadType) {
                                        e.preventDefault();
                                    } else {
                                        return $scope.data.keypadType;
                                    }
                                }
                            }
                        ]
                    });

                    myPopup.then(function(val) {
                        if (val) {
                            $rootScope.config.keypads.push({
                                prefix: keypad.keypadNumberPrefix[copyKeypadNumber - 1],
                                type: val,
                                buttons: []
                            });
                            $scope.keypadsTypes.push({
                                name: keypadName[keypadNumberTmp],
                                type: val,
                                index: keypadNumberTmp
                            });
                            myPopup.close();
                            $scope.data.keypadType = "";
                            $rootScope.copyKeypad[0] = null;
                            $rootScope.enableCopy = true;
                            $rootScope.$apply();
                            $scope.configCopyButton(keypadNumber+1);
                        }
                    });
                });
        } else {
            $rootScope.copyKeypad[0] = null;
            $rootScope.enableCopy = false;
            $rootScope.$apply();
            $localstorage.setObject('keypads', $rootScope.config.keypads);
        }
    };

    $scope.selectTabWithIndex = function(index) {
        $state.go('app.dash');
        //$ionicTabsDelegate.select(index);
    }

    $scope.reset = function() {
        $localstorage.setObject('keypads', []);
        $rootScope.config = {keypads: []};
        $scope.keypadsTypes = [];
        $scope.data.totalKeypad = null;
        $ionicTabsDelegate.select(0);
        $scope.configStepOne();
    }

    $scope.configStepOne();



})
