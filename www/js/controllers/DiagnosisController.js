angular.module('diagnosis.controller', ['starter.services'])

.controller('DiagnosisCtrl', ["$rootScope", "$scope"], function($rootScope, $scope){
    $rootScope.enableDebug = true;
    $scope.diagnosisText = $rootScope.debugMsg;
})