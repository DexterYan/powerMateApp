angular.module('diy.controller', ['starter.services'])


.controller('DIYCtrl', function($scope, $ionicTabsDelegate, SweetAlert) {
    SweetAlert.swal({
       title: "How many keypads do you need?",
       html: true,
       type: "input",
       inputType: "number",
       inputPlaceholder: "Input a number, from 1 to 11",
       showCancelButton: true,
       confirmButtonColor: "#DD6B55",
       confirmButtonText: "Next",
       closeOnConfirm: false},
        function(inputValue){
            $scope.totalNumber = inputValue;
            SweetAlert.swal("Nice!", "You wrote: " + inputValue, "success");
        })
})