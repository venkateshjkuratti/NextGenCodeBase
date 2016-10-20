
ImgVisionApp.controller('datePickerController', function($scope){
    
  $scope.formData      = {};
  $scope.formData.date = "";
  $scope.opened = false;
  $scope.ngModel = ($scope.ngModel)?new Date($scope.ngModel):'';
  $scope.dateFormatUpdated = $scope.dateFormat.split(" ")[0];
//Datepicker
$scope.dateOptions = {
    'year-format': "'yy'",
    'show-weeks' : false
};
    
$scope.open = function(){
    $scope.opened   = true;
}
    
});







