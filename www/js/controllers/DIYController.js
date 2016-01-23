angular.module('diy.controller', ['starter.services'])

.controller('DIYCtrl', function($scope, $ionicTabsDelegate, ngDialog, $rootScope, $localstorage, $state, $ionicPopup, socket) {
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
                            $rootScope.enableDebug = true;
                            socket.connect();
                            setTimeout(function() {
                                alert($rootScope.copyKeypad);
                            }, 1000);
                        }
                    }
                ]
            });
    };

    $scope.configCopyButton = function(keypadNumber) {
        if (keypadNumber < $scope.data.totalKeypad) {
            
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