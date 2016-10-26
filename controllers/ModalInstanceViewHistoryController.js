ImgVisionApp.controller('ModalInstanceViewHistoryController', function ($rootScope, $scope, $uibModalInstance, $location, $http, retrievalResultsServices, adminServices, userDetailsServices, urlConstants, docId, items) {

    $scope.isloading = true;
    $scope.isDataAvailable = false;
    $scope.instanceIds = [];
    $scope.message = '';
    var historyResponse = '';
    userDetailsServices.getUserSystemId().then(function (response) {
        var viewHistoryUrl = null;
        var params;
        //var instanceId = ($location.path() == '/retrieval' || $location.path().indexOf("documentViewer") > -1) ? items : docId;
        var instanceId = docId;
        viewHistoryUrl = urlConstants.viewWorkFlowHistory + $rootScope.userDetails.UserName + '/' + response + '/' + instanceId;
        $http.get(viewHistoryUrl).success(function (response) {
            historyResponse = response;
            if (response.length > 0) {
                angular.element(".docId").text(instanceId);
                angular.element(".workItemId").text(response[0].InstanceID);
                angular.element(".fileNetId").text(response[0].StorageRepositoryId.split('idd_')[1]);
                angular.element(".finishDate").text(response[0].FinishDate);
                angular.element(".createDate").text(response[0].EntryDate);
                angular.element(".finishUser").text(response[0].FinishingUser ? response[0].FinishingUser : "-");
                angular.forEach(response, function (item) {
                    $scope.instanceIds.push(item.InstanceID);
                })
            }
            $scope.viewHistoryDetails = (response.length > 0) ? response[0].HistoryDataList : [];
            $scope.isloading = false;
            if ($scope.viewHistoryDetails.length < 1)
                $scope.isDataAvailable = false;
            else
                $scope.isDataAvailable = true;
            $scope.message = 'No History Available';
        }).error(function (response) {
            $scope.isloading = false;
            $scope.isDataAvailable = false;
            $scope.message = response.Message;
        });

    });
    $scope.updateHistory = function (idx) {
        angular.element(".docId").text(instanceId);
        angular.element(".workItemId").text(historyResponse[idx].InstanceID);
        angular.element(".fileNetId").text(historyResponse[idx].StorageRepositoryId.split('idd_')[1]);
        angular.element(".finishDate").text(historyResponse[idx].FinishDate);
        angular.element(".createDate").text(historyResponse[idx].EntryDate);
        angular.element(".finishUser").text(historyResponse[idx].FinishingUser ? historyResponse[idx].FinishingUser : "-");
        $scope.viewHistoryDetails = historyResponse[idx].HistoryDataList;
    }
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
        $uibModalInstance.dismiss('cancel');
    };




});