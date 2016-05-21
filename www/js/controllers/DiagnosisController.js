angular.module('diagnosis.controller', ['starter.services'])

.controller('DiagnosisCtrl', function($rootScope, $scope, socket){
    $scope.diagnosisText = $rootScope.debugMsg;
    $scope.debugMsg = "";
    $scope.zQuery = function(str) {
        socket.send(str);
    };

    $scope.zx31 = function() {
        socket.sendHex([0x31, 0x80, 0x11,0x01]);
    };

    $scope.zx30 = function() {
        socket.sendHex([0x31, 0x80, 0x11,0x00]);
    };

    $scope.addMsg = function() {
        socket.connect();
    };

    $scope.sendMsg = function (msg) {
        if (msg) {
            socket.send(msg);
        }
    };

    $scope.$on('$ionicView.enter', function(){ //This is fired twice in a row
        $rootScope.enableDebug = true;
    });

    $scope.$on('$ionicView.leave', function(){ //This just one when leaving, which happens when I logout
        $rootScope.enableDebug = false;
    });
});
