
ImgVisionApp.controller('dashboardController', function($scope){
    
    $scope.isLoading = true;
    
    $('#dashboardIframe').load(function () {
        $scope.isLoading = false;
    });
    
});







