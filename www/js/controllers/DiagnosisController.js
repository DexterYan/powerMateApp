angular.module('diagnosis.controller', ['starter.services'])

.controller('DiagnosisCtrl', function($rootScope, $scope, socket, $ionicScrollDelegate){
    $scope.diagnosisText = $rootScope.debugMsg;
    $scope.debugMsg = "";
    setInterval(function () {
        $ionicScrollDelegate.$getByHandle('debugScroll').scrollBottom();
    }, 2000);
    $scope.zQuery = function(str) {
        socket.send(str);
    };

    $scope.addMsg = function() {
        socket.connect();
    };

    $scope.$on('$ionicView.enter', function(){ //This is fired twice in a row
        $rootScope.enableDebug = true;
    });

    $scope.$on('$ionicView.leave', function(){ //This just one when leaving, which happens when I logout
        $rootScope.enableDebug = false;
    });
});
