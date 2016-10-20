ImgVisionApp.controller('ModalInstanceEmailController', function($rootScope, $scope, $uibModalInstance, $http, $window, urlConstants, commonServices, userDetailsServices, items) {

    $scope.isloading = true;
    var emailResponse = "";
    var systemId;
    var docId = items;
    userDetailsServices.getUserSystemId().then(function (response) {
        systemId = response;
        var emailInfoURL = urlConstants.email+'/'+$rootScope.userDetails.UserName+'/'+systemId+'/'+docId+'/';
        $http.get(emailInfoURL).success(function (response) {
            $scope.isloading = false;
            emailResponse = response;
            $scope.toField = response.ToAddress;
            $scope.message = "\n\n"+response.Message;
        }).error(function () {

        });
    });
    $scope.sendEmail = function(){
        var postObj = new Object();
        postObj.UserGPID = $rootScope.userDetails.UserName;
        postObj.SystemId = systemId;
        postObj.FromAddress = emailResponse.FromAddress;
        postObj.ToAddress = $scope.toField;
        postObj.Subject = emailResponse.Subject;
        postObj.Message = $scope.message;

        $http({
            url: urlConstants.sendEmail,
            dataType: 'json',
            method: 'POST',
            data: postObj,
            headers: {
                "Content-type": "application/json"
            }
        }).success(function (response) {
            commonServices.setNotifyMessage("Email sent.");
            $uibModalInstance.dismiss('cancel');
        }).error(function(){
            $uibModalInstance.dismiss('Error in sending Email.');
        })
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});