ImgVisionApp.controller('ModalInstanceAddNotesController', function ($rootScope, $scope, $uibModalInstance, $http, $location, $window, urlConstants, commonServices, userDetailsServices, retrievalResultsServices, adminServices,items) {
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
          var instanceId = ($location.path() == '/retrieval' || $location.path().indexOf("workItemView")>-1)?items:adminServices.getWorkItemId();
          var addNotesURL = ($location.path() == '/retrieval' || $location.path().indexOf("workItemView")>-1)?urlConstants.addDocumentNotes:urlConstants.addNotes;        
          
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
            $uibModalInstance.dismiss('cancel');
            commonServices.setNotifyMessage("Notes added.");
        }).error(function(response){
            var errorMsg = (response && response.Message)?' Error: '+response.Message:'';
            commonServices.setNotifyMessage("Error in adding notes." + errorMsg);
            $uibModalInstance.dismiss('cancel');
        });
  });

  };

  //reloading the page if notes added to see the changes in the grid
 $scope.$on('$locationChangeSuccess', function(next, current) { 
     $scope.$watch(function() { return retrievalResultsServices.getNotesAdded(); }, function(data) {
    	if(data){
            retrievalResultsServices.setNotesAdded(false);
            $window.location.reload();
		}
	});
        
  });

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

    
});