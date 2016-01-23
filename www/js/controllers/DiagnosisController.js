angular.module('diagnosis.controller', ['starter.services'])

.controller('DiagnosisCtrl', function($rootScope, $scope){
    $rootScope.enableDebug = true;
    $scope.diagnosisText = $rootScope.debugMsg;
});