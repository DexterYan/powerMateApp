angular.module('diagnosis.controller', ['starter.services'])

.controller('DiagnosisCtrl', function($rootScope, $scope){
    $rootScope.enableDebug = true;
    $scope.diagnosisText = $rootScope.debugMsg;
    
    $scope.zx31 = function() {
        socket.send([0x31]);
    }
    
    $scope.zx30 = function() {
        socket.send([0x30]);
    }
    
    $scope.reset = function() {
        $localstorage.setObject('keypads', []);
        $rootScope.config = {keypads: []};
        $scope.keypadsTypes = [];
        $scope.data.totalKeypad = null;
        $ionicTabsDelegate.select(0);
        $scope.configStepOne();
    }
});