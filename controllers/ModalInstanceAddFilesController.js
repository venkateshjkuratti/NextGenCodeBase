ImgVisionApp.controller('ModalInstanceAddFilesController', function ($scope, $http, $uibModalInstance, $location, uploadServices, $rootScope, urlConstants, userDetailsServices, retrievalResultsServices, items) {
    var addPageURL = "";
    $scope.uploadedList = [];
    $scope.deleteFile = function (index) {
        $scope.uploadedList.splice(index, 1);
        $('.choose-file input').val('');
    }
    
    $scope.$watch(function () {
        return uploadServices.getFiletoUpload();
    }, function (newValue, oldValue) {
        angular.element(".fileType").text("");
        if (newValue!=oldValue && newValue === 'invalid') {
            $scope.uploadedFileList = [];
            angular.element(".fileType").text('File Size is greater than limited size');
        }
        else if (newValue!=oldValue && newValue !== null) {
            $scope.uploadedList = [];
            var validFormats = ["application/pdf"];
            if(validFormats.indexOf(newValue.type)== -1){                
                angular.element(".fileType").text('Error: File type other than PDF selected, unable to process request. Please remove and add only PDF document.');
                return false;
            }
            $scope.addDocument = newValue;
            $scope.uploadedList.push($scope.addDocument);
        } else if (newValue == null) {
            $scope.uploadedList = [];
        } else {
            $scope.uploadDocument = newValue;
        }

    });
    
    

    $scope.$watch(function(){
        return $scope.addDocument;
    }, function(newValue, oldValue){
        if(newValue != oldValue)
            $scope.isFileExist=(newValue!=undefined);
    });
    
    $scope.addPageUploader = function(){
        //console.log($scope.user.inputAddFile);
        $scope.isUploading = true;
        var userGPID = $rootScope.userDetails.UserName;  
        var fd = new FormData();
        $scope.uploadSuccess = false;
        fd.append('file', $scope.addDocument);
		
        userDetailsServices.getUserSystemId().then(function (response) { 
         addPageURL = urlConstants.addPages + userGPID + '/' + response + '/' + items+ '/';
         $http({
                url: addPageURL,
                method: 'POST',
                data:fd,
                headers: {
                    "content-type": undefined
                },
                transformRequest: angular.identity
            }).success(function (response) {
             if($location.path().indexOf("workItemView")>-1){
                 var currURL = $location.path();
                 currURL = $location.path().split("/idd_")[0]+'/'+response+'/'+$location.path().split("/idd_")[1].split("/")[1];
                 $location.path(currURL);
             }
             else{
                 var currObj = retrievalResultsServices.getSelectedRow();
                 currObj.ID = response;
                 retrievalResultsServices.setFileNetId(response);
             }
                 $scope.uploadSuccess = true;              
                 $scope.isUploading = false;
                 $scope.uploadedList = [];
        }).error(function(response){
             console.log(response);
             $scope.isUploading = false;
             $scope.uploadFailure = true;
         })
        
    });
    }
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});