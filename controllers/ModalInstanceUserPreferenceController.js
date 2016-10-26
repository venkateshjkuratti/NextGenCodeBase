ImgVisionApp.controller('ModalInstanceUserPreferenceController', function ($rootScope, $scope, $filter, $uibModalInstance, $location, $http, userDetailsServices, commonServices, urlConstants) {
    var systemID;
    var getUserPreferencesURL;
    var userPrefData;
    
    $scope.buttons = false;
    
    localStorage.setItem('setUserPerferenceRoutingButton', $scope.buttons);
    
    $scope.isSetOrder = function (type) {
        
        return $scope.orderType === type;
    }
    userDetailsServices.getUserSystemId().then(function (response) {
        systemID = response;
        getUserPreferencesURL = urlConstants.getUserPreferences;

        $http.get(getUserPreferencesURL+$rootScope.userDetails.UserName+'/'+systemID).success(function(response){
            userPrefData = response;
            angular.forEach(response, function (item) {
                if(item.DateFormatOptions.length>0){
                    $scope.dateFormatText = item.Language;
                    /*angular.forEach(item.DateFormatOptions,function(i){
                        i.PreferenceValue= i.PreferenceValue.toUpperCase().trim();
                    });*/
                    $scope.searchFieldOptions = item.DateFormatOptions;
                }
                switch (item.PreferenceTitle) {
                    case 'Date Format Display':
                        $scope.dateFormatText = item.PreferenceValue;
                        break;
                    case 'Username display':
                        if(item.PreferenceValue==="true")
                            $scope.fullname = true;
                        else
                            $scope.gpid = true;
                        break;
                    case 'Routing in Workflow':
                        if(item.PreferenceValue==="true")
                            $scope.buttons = true;
                        else
                            $scope.dropdown = true;
                        break;
                    case 'Sent to workflow':
                        $scope.isSendToWorkflowEnabled = item.CanOverride;
                        if(item.PreferenceValue==="true")
                            $scope.toWorkflow = true;
                        else
                            $scope.notToWorkflow = true;
                        break;
                    case 'Email notification':
                        $scope.isEmailNotifyEnabled = item.CanOverride;
                        if(item.PreferenceValue==="true")
                            $scope.sendEmail = true;
                        else
                            $scope.noSendEmail = true;
                        break;
                }
            });
        }).error(function(){
            commonServices.setNotifyMessage("Error in loading user preferences.");
        });
    });
    $scope.saveUserPref = function(){
        var saveUserPrefURL = urlConstants.saveUserPreferences+'?systemId='+systemID;
        var postObj =[];
        angular.forEach(userPrefData, function (item,index) {
            postObj.push(item);
            var prefVal = item.PreferenceValue;
            switch (userPrefData[index].PreferenceTitle) {
                case 'Date Format Display':
                    postObj[index].PreferenceValue = $scope.dateFormatText;
                    break;
                case 'Username display':
                    postObj[index].PreferenceValue = ($scope.fullname)?"true":"false";
                    break;
                case 'Routing in Workflow':
                    postObj[index].PreferenceValue = ($scope.buttons)?"true":"false";
                    break;
                case 'Sent to workflow':
                    postObj[index].PreferenceValue = ($scope.toWorkflow)?"true":"false";
                    break;
                case 'Email notification':
                    postObj[index].PreferenceValue = ($scope.sendEmail)?"true":"false";
                    break;
            };
            postObj[index].IsUpdated = (prefVal == postObj[index].PreferenceValue)?false:true;
        });
        angular.element(".saveUserPrefMsg").text("");
        $scope.isUserPreferencesLoading = true;
        $http({
            url: saveUserPrefURL,
            dataType: 'json',
            method: 'POST',
            data: postObj,
            headers: {
                "Content-type": "application/json"
            }
        }).success(function(response){
            $scope.isUserPreferencesLoading = false;
            var text = $filter('translate')("Saved user preferences for user");
            angular.element(".saveUserPrefMsg").text(text+' '+$rootScope.userDetails.UserName+".");
                        
            angular.element(".saveUserPrefMsg").addClass("success");
             if($scope.buttons){
              localStorage.setItem('setUserPerferenceRoutingButton', 'button');  
            }
            else{
               localStorage.setItem('setUserPerferenceRoutingButton', 'select'); 
            }
        }).error(function(response){
            console.log(response);
            $scope.isUserPreferencesLoading = false;
            angular.element(".saveUserPrefMsg").text("Error code:"+response.ErrorCode+" - Unable to save user preference for user "+$rootScope.userDetails.UserName+".");
            angular.element(".saveUserPrefMsg").addClass("error");
        });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});