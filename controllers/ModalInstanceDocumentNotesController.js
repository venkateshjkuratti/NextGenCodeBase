ImgVisionApp.controller('ModalInstanceDocumentNotesController', function ($rootScope, $scope, $uibModalInstance, $location, $http, $routeParams, urlConstants, userDetailsServices,commonServices, retrievalResultsServices,adminServices,docId,items) {

    $scope.isloading = true;
    $scope.isWorkflowDocument = ($location.path() == '/admin' || $location.path().indexOf("002") != -1);
    
    userDetailsServices.getUserSystemId().then(function (response) {
        
      //console.log(items +" "+docId)
        var viewnotesUrl = '';
        var instanceId = docId;
        var fileNetId = ($location.path() == '/retrieval')?retrievalResultsServices.getFileNetId():( $location.path().indexOf("documentViewer")>-1)?$routeParams.storageRepoId.split("_")[1]:adminServices.getStorageRepoId();
        
        var currModalURL= urlConstants.viewDocumentNotes;
        viewnotesUrl =  currModalURL + $rootScope.userDetails.UserName + '/'+response +'/'+instanceId;
        
        console.log(instanceId);
        
        $http.get(viewnotesUrl).success(function (response) {            
            angular.element(".instanceId").text(instanceId);
            angular.element(".documentId").text(fileNetId);
            $scope.viewNotesDetails = response;
            $scope.isloading = false;
            if ($scope.viewNotesDetails.length < 1)
                $scope.isDataAvailable = false;
            else
                $scope.isDataAvailable = true;
            $scope.message = 'No Notes Available';
        }).error(function (response) {
            $scope.isloading = false;
            $scope.isDataAvailable = false;
            $scope.message = response.ErrorCode +' : '+ response.Message;
        });

    });

    $scope.sortItems = function (value, type) {
        $scope.sort = value;
        if ($scope.orderType != type)
            $scope.orderType = type;
        else
            $scope.orderType = -1;
    }

    $scope.isSetOrder = function (type) {
        return $scope.orderType === type;
    }


    $scope.cancel = function () {
        $uibModalInstance.close($scope.isDataAvailable);
        $uibModalInstance.dismiss('cancel');
    };
    
        $scope.isSubmitDisabled = true;
            var addNotesFinalURL; 
            $scope.isTextAreaEmpty = function(val){
              if(val==''){
                  $scope.isSubmitDisabled = true;
              }
              else{
                  $scope.isSubmitDisabled = false;
              }
                } 

  $scope.ok = function (data) {
      
    
      userDetailsServices.getUserSystemId().then(function (response) {
          var instanceId;
          console.log('sgg'+items);
          //for Retrieval page since it doesn't has a docTypeId
          if($location.path() == '/retrieval' || items==1){
             instanceId = docId;
           }
          else{
              instanceId = items;
          }
                    
          var addNotesURL = urlConstants.addDocumentNotes;        
          
        addNotesFinalURL = addNotesURL + $rootScope.userDetails.UserName + '/'+response +'/'+instanceId;
        var postObj= new Object();
        postObj.Text = $scope.notes;
          $http({
            url: addNotesFinalURL,
            dataType: 'json',
            method: 'POST',
            data: postObj,
            headers: {
                "Content-type": "application/json"
            }
        }).success(function(response){
              
            retrievalResultsServices.setNotesAdded(true);
            $scope.notes = '';
            userDetailsServices.getUserSystemId().then(function (response) {
            var viewnotesUrl = '';
            var currModalURL= urlConstants.viewDocumentNotes;
            var instanceId = docId;
            var fileNetId = ($location.path() == '/retrieval')?retrievalResultsServices.getFileNetId():( $location.path().indexOf("documentViewer")>-1)?$routeParams.storageRepoId.split("_")[1]:adminServices.getStorageRepoId();
            viewnotesUrl =  currModalURL + $rootScope.userDetails.UserName + '/'+response +'/'+instanceId;
            $http.get(viewnotesUrl).success(function (response) {            
                angular.element(".instanceId").text(instanceId);
                angular.element(".documentId").text(fileNetId);
                $scope.viewNotesDetails = response;
                $scope.isloading = false;
                if ($scope.viewNotesDetails.length < 1)
                    $scope.isDataAvailable = false;
                else
                $scope.isDataAvailable = true;
                $scope.message = 'No Notes Available';
            }).error(function (response) {
                $scope.isloading = false;
                $scope.isDataAvailable = false;
                $scope.message = response.ErrorCode +' : '+ response.Message;
            });

    });

            commonServices.setNotifyMessage("Notes added.");
        }).error(function(response){
            var errorMsg = (response && response.Message)?' Error: '+response.Message:'';
            commonServices.setNotifyMessage("Error in adding notes." + errorMsg);
            $uibModalInstance.dismiss('cancel');
        });
  });

  };


});