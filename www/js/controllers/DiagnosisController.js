angular.module('diagnosis.controller', ['starter.services'])

.controller('DiagnosisCtrl', function($rootScope, $scope, socket){
    $rootScope.enableDebug = true;
    $scope.diagnosisText = $rootScope.debugMsg;
    
    $scope.zx31 = function() {
        socket.sendHex([0x31, 0x80, 0x11,0x01]);
    }
    
    $scope.zx30 = function() {
        socket.sendHex([0x31, 0x80, 0x11,0x00]);
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