ImgVisionApp.controller('ModalInstanceViewNotesController', function ($rootScope, $scope, $uibModalInstance, $location, $http, $routeParams, urlConstants, userDetailsServices, commonServices, retrievalResultsServices, adminServices, docId, items) {

    $scope.isloading = true;
    $scope.isRetrievalWorkflow = $location.path() == '/retrieval'
    userDetailsServices.getUserSystemId().then(function (response) {

        var viewnotesUrl = '';

        var currModalURL = urlConstants.viewWorkFlowNotes;
        var instanceId = docId;
        var fileNetId = ($location.path() == '/retrieval') ? retrievalResultsServices.getFileNetId() : ($location.path().indexOf("workItemView") > -1) ? $routeParams.storageRepoId.split("_")[1] : adminServices.getStorageRepoId();

        viewnotesUrl = currModalURL + $rootScope.userDetails.UserName + '/' + response + '/' + instanceId;
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
            $scope.message = response.ErrorCode + ' : ' + response.Message;
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
    $scope.isTextAreaEmpty = function (val) {
        if (val == '') {
            $scope.isSubmitDisabled = true;
        } else {
            $scope.isSubmitDisabled = false;
        }
    }

    $scope.ok = function (data) {


        userDetailsServices.getUserSystemId().then(function (response) {
            var instanceId = items;
            var addNotesURL = urlConstants.addNotes;
            addNotesFinalURL = addNotesURL + $rootScope.userDetails.UserName + '/' + response + '/' + instanceId;
            var postObj = new Object();
            postObj.Text = $scope.notes;
            $http({
                url: addNotesFinalURL,
                dataType: 'json',
                method: 'POST',
                data: postObj,
                headers: {
                    "Content-type": "application/json"
                }
            }).success(function (response) {

                retrievalResultsServices.setNotesAdded(true);
                $scope.notes = '';
                userDetailsServices.getUserSystemId().then(function (response) {
                    var viewnotesUrl = '';
                    var currModalURL = urlConstants.viewWorkFlowNotes;
                    var instanceId = docId;
                    var fileNetId = ($location.path() == '/retrieval') ? retrievalResultsServices.getFileNetId() : ($location.path().indexOf("workItemView") > -1) ? $routeParams.storageRepoId.split("_")[1] : adminServices.getStorageRepoId();
                    viewnotesUrl = currModalURL + $rootScope.userDetails.UserName + '/' + response + '/' + instanceId;
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
                        $scope.message = response.ErrorCode + ' : ' + response.Message;
                    });

                });

                commonServices.setNotifyMessage("Notes added.");
            }).error(function (response) {
                var errorMsg = (response && response.Message) ? ' Error: ' + response.Message : '';
                commonServices.setNotifyMessage("Error in adding notes." + errorMsg);
                $uibModalInstance.dismiss('cancel');
            });
        });

    };

});