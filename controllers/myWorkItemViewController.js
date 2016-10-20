ImgVisionApp.controller('myWorkItemViewController', function($rootScope, $scope,
 $log, $http, $window, $uibModal, $routeParams, $sce, $location, urlConstants, 
 commonServices, myWorkItemBasketServices, uploadServices, adminServices,
  userDetailsServices){
	
    
    var fileNetID = $routeParams.storageRepoId.split("_")[1];
    
    var instanceId = $routeParams.instanceId;
    var docTypeId = $routeParams.docTypeId;
    
    var isWorkItemMoved = false;
    
    var pageType = $routeParams.type;
    
    var itemData = null;
    
    var staticTabLink;
    
    $scope.isLoading = true;
    $scope.isReadOnly = false;
    var workFlowViewEmitter = {
        basket:'001',
        workFlow:'002',
        retrieval:'003'
    }
    var systemId;
    var link = null;
    myWorkItemBasketServices.setFileNetId($routeParams.storageRepoId);
    
    myWorkItemBasketServices.setWorkItemId(instanceId);

    
    $scope.pageUrl = 'https://content.dev.mypepsico.com/navigator/bookmark.jsp?desktop=filenet&repositoryId=Base&docid='+fileNetID;
    $scope.iframeUrl = $sce.trustAsResourceUrl($scope.pageUrl);

    userDetailsServices.getUserSystemId().then(function (response) {   
        $scope.isSelectResultsLoading = true;
        $scope.isSelectResultsAvailable = false;
        systemId = response;
        var linkURL = urlConstants.link+'/'+$rootScope.userDetails.UserName + '/'+systemId+'/'+$routeParams.storageRepoId;
        $http.get(linkURL, {cache: false})
            .success(function (response) {
                $scope.link = response;
            })
            .error(function () {
                console.log("error in retrieving link");
            })
        $scope.isReadOnly=!$rootScope.userDetails.CanEditRetrieval;
        selectFields = urlConstants.workItemIndexingFields +$rootScope.userDetails.UserName + '/'+ systemId +'/'+docTypeId+'/'+$routeParams.storageRepoId;
        
        $http.get(selectFields, {
            cache: false
        }).success(function (response) {
            $scope.selectResults = response;
            $scope.isSelectResultsLoading = false;
            $scope.isSelectResultsAvailable = true;
        }).error(function () {
            $scope.isSelectResultsLoading = false;
            $scope.isSelectResultsAvailable = false;
        });
    });
    $scope.saveWorkItem = function(){
        commonServices.setNotifyMessage("Saving indexing fields");
        var postObject = new Object();
        var searchBoxes = angular.element('.search-field-boxes');
            angular.forEach(searchBoxes, function (value, key) {
                var inputVal = "";
                var searchOp = "";
                var currObj = angular.element(value);
                if (currObj.hasClass('text_box')) {
                    inputVal = currObj.find('.input-text').val();
                } else if (currObj.hasClass('date')) {
                    inputVal = currObj.find('.input-date').val();
                } else if (currObj.hasClass('combo_box')) {
                    var idx = parseInt(currObj.find('.select.form-control').val());
                    
                    inputVal = currObj.find('.select.form-control option:selected').text();
                } else if (currObj.hasClass('check_box')) {
                    inputVal = currObj.find('input').hasClass('ng-not-empty') ? 'true' : 'false';
                }
                $scope.selectResults[key].ValueAsString = inputVal;
            });
		var saveIndexFieldsUrl = urlConstants.saveIndexingFields+$rootScope.userDetails.UserName+'/'+systemId+'/'+$routeParams.storageRepoId+'/true';
       $http({
            url: saveIndexFieldsUrl,
            dataType: 'json',
            method: 'POST',
           data: $scope.selectResults,
            headers: {
                "Content-type": "application/json"
            }
        }).success(function (response) {
           if(response)
                commonServices.setNotifyMessage("Saved the details successfully.");
           else
               commonServices.setNotifyMessage("Error while saving data.");
       }).error(function (response) {
            commonServices.setNotifyMessage("Error while saving");
        });
    }
    $scope.MoveWorkItem = function(buttonQueueId, name){
        
    var postUrl;
        
    //actions specfic to 'Return' Button
    if(name == 'Return')
    postUrl = routingActionUrl+'/'+instanceId+'/'+buttonQueueId+'/Return'
    else
    postUrl = routingActionUrl+'/'+instanceId+'/'+buttonQueueId+'/Forward' 
        
        
      $http.get(postUrl).success(function(response){
          isWorkItemMoved = true;
          if(pageType == workFlowViewEmitter.basket)
          $location.path('/home');
          else
          $location.path('/admin');
           
       }).error(function(error){
          $scope.error=true;
       });

    }
    
    
    //set the dropdowns for clicked tabs
    $scope.setDropDown = function(name,$event){
        if($scope.activeDropDown != name){
            $scope.activeDropDown = name;
        }
        else {
            $scope.activeDropDown = -1;
        }
      $('.copy-link').css('left',angular.element($event.target).prop('offsetLeft')+24+'px');
       getStaticTabLink();
    }
    
    function getStaticTabLink(){
        $http.get(staticTabLink+'/'+myWorkItemBasketServices.getFileNetId()).success(function(response){
               $scope.link = response;
        }).error(function(){

        });
    }
    
    $scope.isDropDownActive = function(name){
        return $scope.activeDropDown === name;
    }    
    
 $scope.addFilesWorkItem = function () {
    
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'partials/addPage.html',
      controller: 'ModalInstanceAddFilesController',
      resolve: {
        items: function () {
          return $routeParams.storageRepoId;
        }
      }
    });

    modalInstance.result.then(function () {
    }, function () {
         //reload the page with newFileNetId from the uploaded file responses
          if(uploadServices.uploadSuccess() != null){
          var fileNetId = uploadServices.getNewFileNetId()+'/';
          var currentPath = $location.path();
          var pattern = /(\idd.*?\/)/gi;
          var newPath = currentPath.replace(pattern,fileNetId);
          $location.path(newPath);
      }    
      
    });
        
        
    
  };
    

 $scope.downloadWorkItem = function(){
     var downloadURL = urlConstants.downloadWorkItem+$rootScope.userDetails.UserName + '/'+ systemId+'/'+$routeParams.storageRepoId;
     $http.get(downloadURL).success(function(response){
         window.open(response);
     }).error(function(){
         commonServices.setNotifyMessage("Error in loading download link.");
     })
  }

  
  $scope.showViewHistoryWorkItemView = function () {
    
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'partials/viewHistory.html',
      controller: 'ModalInstanceViewHistoryController',
      resolve: {
        items: function () {
          return instanceId;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
   
  };
    
  
 $scope.showViewNotes = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/WorkflowNotes.html',
            controller: 'ModalInstanceViewNotesController',
            resolve: {
                items: function () {
                  return instanceId;
                },
                docId: function(){
                   return instanceId;  
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };

     $scope.showDocumentNotesAdmin = function () {
       
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/DocumentNotes.html',
            controller: 'ModalInstanceDocumentNotesController',
           resolve: {
                items: function () {
                     return instanceId;
                },
                docId: function(){
                    return instanceId;  
                }
            }
        });
        
       modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
        

    };
     $scope.showEmailModal = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/email.html',
            controller: 'ModalInstanceEmailController',
            resolve: {
                items: function () {
                    return $routeParams.storageRepoId;
                }
            }
        });

    };
    

    
    $scope.copyLink = function(){
        commonServices.setNotifyMessage("Link is copied.");
    }
 $scope.getICNUrl = function(){
        
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'partials/viewICNUrl.html',
      controller: 'ModalInstanceLinkController'
    });

        
    }
 
 //re-directs to previous page
 $scope.reDirectToPreviousPage = function(){
     var prevUrl = $rootScope.history.length > 1 ? $rootScope.history.splice(-2)[0] : "/";
     $location.path(prevUrl);
     adminServices.setAdminTabsDisabled(true);
     adminServices.setCurrentAdminQueueWorkItemDetails(null);
     myWorkItemBasketServices.setAddFilesDisabled(true);
     $rootScope.history = []; //Delete history array after going back
 }
 

  $scope.$on('$locationChangeSuccess', function(next, current) { 
 
    if(isWorkItemMoved==true)
        $window.location.reload();     
    });
    
    
    $('#workItemIframe').load(function () {
        $scope.isLoading = false;
    });
    
        
  });













