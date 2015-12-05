angular.module('diy.controller', ['starter.services'])

.controller('DIYCtrl', function($scope, $ionicTabsDelegate, ngDialog, $rootScope, $localstorage, $state) {
     var keypadName = ['First', 'Second', 'Third', 'Fourth',
                                        'Fifth', 'Sixth', 'Seventh', 'Eighth'];
    $scope.keypadsTypes = [];
    $scope.configStepTwo = function(keypadNumber) {
        var keypadNumberTmp = keypadNumber - 1;
        ngDialog.open({
            template: 'stepTwo',
            closeByDocument: false,
            showClose: false,
            scope: $scope,
            controller: ['$scope', function($scope) {
                $scope.keypadName = keypadName[keypadNumberTmp];
                $scope.confirm = function(valName, val) {
                    if (val) {
                        $rootScope.config.keypads.push({type: val, buttons: []});
                        $scope.$parent.keypadsTypes.push({
                            name: keypadName[keypadNumberTmp],
                            type: val,
                            index: keypadNumberTmp
                        });
                        $scope.closeThisDialog();
                        if (keypadNumber < $scope.totalKeypad) {
                            console.log(keypadNumber);
                            $scope.configStepTwo(keypadNumber+1);
                        } else {
                            $localstorage.setObject('keypads', $rootScope.config.keypads);
                        }
                    }
                }
            }]
        });
    };

    $scope.configStepTwoModify = function(index) {
        ngDialog.open({
            template: 'stepTwo',
            closeByDocument: false,
            showClose: false,
            scope: $scope,
            controller: ['$scope', function($scope) {
                $scope.keypadName = keypadName[index];
                $scope.confirm = function(valName, val) {
                    if (val) {
                        $rootScope.config.keypads[index].type = val;
                        $localstorage.setObject('keypads', $rootScope.config.keypads);
                        $scope.$parent.keypadsTypes[index].type = val;
                        $scope.closeThisDialog();
                    }
                }
            }]
        });
    }


    $scope.configStepOne = function() {
            ngDialog.open({
                template: 'stepOne',
                closeByDocument: false,
                showClose: false,
                scope: $scope,
                controller: ['$scope', function($scope) {
                    $scope.confirm = function(valName, val) {
                        if (val) {
                            $scope.$parent[valName] = val;
                            $rootScope.config ={};
                            $rootScope.config.keypads = [];
                            $scope.$parent.keypadsTypes = [];
                            $scope.closeThisDialog();
                            $scope.configStepTwo(1);
                        }
                    }
                }]
            });
    }

    $scope.selectTabWithIndex = function(index) {
        $state.go('app.dash');
        //$ionicTabsDelegate.select(index);
    }

    $scope.reset = function() {
        $localstorage.setObject('keypads', []);
        $rootScope.config = {keypads: []};
        $scope.keypadsTypes = [];
        $scope.totalKeypad = null;
        $ionicTabsDelegate.select(0);
        $scope.configStepOne();
    }

    $scope.configStepOne();

})