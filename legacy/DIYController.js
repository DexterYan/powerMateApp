angular.module('diy.controller', ['starter.services'])

.controller('DIYCtrl', function($scope, $ionicTabsDelegate, ngDialog, $rootScope, $localstorage, $state, $ionicPopup) {
     var keypadName = ['First', 'Second', 'Third', 'Fourth',
                                        'Fifth', 'Sixth', 'Seventh', 'Eighth'];
    $scope.keypadsTypes = [];

    $scope.configStepTwo = function(keypadNumber) {
        var keypadNumberTmp = keypadNumber - 1;
        var myPopup = $ionicPopup.show({
            template: '<select ng-model="data.keypadType">' +
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
                        console.log($scope.data)
                        //don't allow the user to close unless
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
                $rootScope.config.keypads.push({type: val, buttons: []});
                $scope.keypadsTypes.push({
                    name: keypadName[keypadNumberTmp],
                    type: val,
                    index: keypadNumberTmp
                });
                myPopup.close();
                if (keypadNumber < $scope.data.totalKeypad) {
                    $scope.data.keypadType = "";
                    $scope.configStepTwo(keypadNumber+1);
                } else {
                    $localstorage.setObject('keypads', $rootScope.config.keypads);
                }
            }
        })

    };

    $scope.configStepTwoModify = function(index) {

        var myPopup = $ionicPopup.show({
            template: '<select ng-model="data.keypadType">' +
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
                        //don't allow the user to close unless
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
                $rootScope.config.keypads[index].type = val;
                $localstorage.setObject('keypads', $rootScope.config.keypads);
                $scope.keypadsTypes[index].type = val;
                myPopup.close();
            }
        });

    }


    $scope.configStepOne = function() {
       $scope.data = {}
        var myPopup = $ionicPopup.show({
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

        myPopup.then(function(res) {
            if (res) {
                $rootScope.config ={};
                $rootScope.config.keypads = [];
                $scope.keypadsTypes = [];
                myPopup.close();
                $scope.configStepTwo(1);
            }
        })
    }

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