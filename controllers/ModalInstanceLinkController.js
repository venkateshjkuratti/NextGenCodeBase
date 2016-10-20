ImgVisionApp.controller('ModalInstanceLinkController', function($scope, $uibModalInstance, $http, $window, myWorkItemBasketServices) {
    
   
    $scope.isloading = true;
    
    $scope.isCopySuccess = false;
    
    $scope.link = '';
    
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
    };
    
    $scope.isCopySuccess = function(){
        $uibModalInstance.dismiss('cancel');
    }
            

        
        
    
});