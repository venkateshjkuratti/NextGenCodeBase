ImgVisionApp.controller('ModalInstanceExportExcelController', function ($rootScope, $scope, $http, $q, $uibModalInstance,
uploadServices, commonServices, urlConstants) {
    $scope.isDownloading = true;
    angular.element(".statusUpdate").text("Retrieving data...");
    var canceler = $q.defer();
      $http({
        url: urlConstants.exportExcel,
        dataType: 'json',
        method: 'POST',
        data: $rootScope.searchParameters,
        headers: {
            "Content-type": "application/json"
        },
          timeout: canceler.promise
        }).success(function(response){
            var blob = new Blob([response], {type: 'text/csv'});
            if(window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, 'Retrieval Data.csv');
            }
            else{
                var elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(blob);
                elem.download = 'Retrieval Data.csv';        
                document.body.appendChild(elem);
                elem.click();        
                document.body.removeChild(elem);    
            }
          $uibModalInstance.dismiss('cancel');
          commonServices.setNotifyMessage("File downloaded successfully.");
        }).error(function(response){
          commonServices.setNotifyMessage("Error while downloading excel file.");
      });
    
    $scope.cancelRequest = function(){
        angular.element(".statusUpdate").text("Request cancelled.");
        $uibModalInstance.dismiss('cancel');
        canceler.resolve();
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});