angular.module('diagnosis.controller', ['starter.services'])

.controller('DashCtrl', ["$rootScope", "$scope"], function($rootScope, $scope){
    $scope.diagnosisText = $rootScope.result;
})