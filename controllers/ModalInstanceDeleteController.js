ImgVisionApp.controller('ModalInstanceDeleteController', function($scope, $uibModalInstance, $http, $location, $window, $q, $timeout, adminServices,commonServices, urlConstants, items) {
   
    var deleteWorkItem;    
    $scope.isLoading = false;    
    $scope.isDeleteSuccess = false;    
    $scope.error = false;    
    deleteWorkItem = urlConstants.deleteWorkItem;
    
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
    };
    
    $scope.delete = function(){        
    $scope.isLoading = true;
    $http({
        url: deleteWorkItem,
        dataType: 'json',
        method: 'POST',
        data: items,
        headers: {
            "Content-type": "application/json"
        }
   }).success(function(response){
        $scope.isLoading = false;
        $scope.isDeleteSuccess = true;
        $uibModalInstance.close($scope.isDeleteSuccess);
        commonServices.setNotifyMessage("Successfully deleted.")
    }).error(function(response){
        $scope.isLoading = false;
        $scope.error = true;
        $scope.isDeleteSuccess = false;
        $scope.message = response.Message;
    });
        
    }
 
});