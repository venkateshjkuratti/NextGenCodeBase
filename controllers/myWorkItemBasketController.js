ImgVisionApp.controller('myWorkItemBasketController', function ($scope, myWorkItemBasketServices, $log, $uibModal, $window, $timeout, $location, myWorkItemViewServices, urlConstants, userDetailsServices, uploadServices, $http, $filter) {

    
    $scope.error = false;

    $scope.isDataAvailable = false;

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    
    $scope.itemListOption = [10,20, 50, 100];
    $scope.itemsPerPageOnSelect = $scope.itemListOption[0];
    
    $scope.sortOrder = ['InstanceID'];
    
    $scope.myWorkItemBasketDetails = [];

    $scope.noInstancesSelected = false;

    var staticTabLink = null;
    var workItemBasket;

    myWorkItemBasketServices.getData().then(

        function () {
            $timeout(function () {
                $scope.isloading = true;
                $scope.myWorkItemBasketDetails = myWorkItemBasketServices.myData();
                $scope.totalItems = $scope.myWorkItemBasketDetails.length;
                $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
                $scope.toInim = ($scope.currentPage) * $scope.itemsPerPage;
                $scope.to = $scope.toInim > $scope.totalItems ? $scope.totalItems : $scope.toInim;
                $scope.isloading = false;
                if ($scope.totalItems == 0) {
                    $scope.error = true;
                    $scope.isDataAvailable = false;
                } else {
                    $scope.error = false;
                    $scope.isDataAvailable = true;
                }
            }, 1000);

        },
        function () {
            $scope.error = true;
            $scope.isloading = false;
            $scope.isDataAvailable = false;
        });

    userDetailsServices.getUserDetails().then(function () {
        workItemBasket = urlConstants.myWorkItemBasket;
    });

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.toInim = ($scope.currentPage) * $scope.itemsPerPage;
        $scope.to = $scope.toInim > $scope.totalItems ? $scope.totalItems : $scope.toInim;

    };

    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1;
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
    
    $scope.getItemsPerPage = function(count){
        $scope.itemsPerPage = count;
        $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.toInim = ($scope.currentPage) * $scope.itemsPerPage;
        $scope.to = $scope.toInim > $scope.totalItems ? $scope.totalItems : $scope.toInim;
    }

    $scope.setInstances = function (instanceId, docId) {
        if ($scope.instanceRow != instanceId) {
            $scope.instanceRow = instanceId;
            myWorkItemBasketServices.setPrintDisabled(false);
            myWorkItemBasketServices.setEmailDisabled(false);
            myWorkItemBasketServices.setLinkDisabled(false);
            myWorkItemBasketServices.setAddFilesDisabled(false);
            myWorkItemBasketServices.setViewHistoryDisabled(false);
            myWorkItemBasketServices.setViewNotesDisabled(false);
            myWorkItemBasketServices.setWorkItemId(instanceId);
            myWorkItemBasketServices.setFileNetId(docId);


        } else {
            $scope.instanceRow = -1;
            myWorkItemBasketServices.setPrintDisabled(true);
            myWorkItemBasketServices.setEmailDisabled(true);
            myWorkItemBasketServices.setLinkDisabled(true);
            myWorkItemBasketServices.setAddFilesDisabled(true);
            myWorkItemBasketServices.setViewHistoryDisabled(true);
            myWorkItemBasketServices.setViewNotesDisabled(true);
            myWorkItemBasketServices.setWorkItemId(null);
            myWorkItemBasketServices.setFileNetId(null);
        }
    }

    $scope.isSet = function (instanceId) {
        return $scope.instanceRow === instanceId;
    }

    $scope.isViewHistoryDisabled = function () {
        return myWorkItemBasketServices.getViewHistoryDisabled();
    }

    $scope.isViewNotesDisabled = function () {
        return myWorkItemBasketServices.getViewNotesDisabled();
    }

    $scope.isPrintDisabled = function () {
        return myWorkItemBasketServices.getPrintDisabled();
    }

    $scope.isEmailDisabled = function () {
        return myWorkItemBasketServices.getEmailDisabled();
    }

    $scope.isLinkDisabled = function () {
        return myWorkItemBasketServices.getLinkDisabled();
    }

    $scope.isAddFilesDisabled = function () {
        return myWorkItemBasketServices.getAddFilesDisabled();
    }

    $scope.refreshPage = function () {
        refreshWorkBasket();
    }

    $scope.getICNUrl = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/viewICNUrl.html',
            controller: 'ModalInstanceLinkController'
        });


    }


    $scope.isDropDownActive = function (name) {
        return $scope.activeDropDown === name;
    }

    $scope.addFilesWorkItemBasket = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/addFiles.html',
            controller: 'ModalInstanceAddFilesController'
        });

        modalInstance.result.then(function () {}, function () {
            if (uploadServices.uploadSuccess() != null)
                $window.location.reload();
        });

    };

    $scope.showViewHistory = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/viewHistory.html',
            controller: 'ModalInstanceViewHistoryController',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

    };


    $scope.showViewNotes = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/WorkflowNotes.html',
            controller: 'ModalInstanceViewNotesController',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };
    
    $scope.clearAlertMessages = function(){
        $scope.showWorkItemStatusMessage = false;
        $scope.isApiCallsSuccess = false;
        $scope.error = false;
    }

    function refreshWorkBasket() {
        $scope.clearAlertMessages();
        $scope.isloading = true;
        $scope.isDataAvailable = false;
        $http.get(workItemBasket).success(function (response) {
            $scope.myWorkItemBasketDetails = myWorkItemBasketServices.myData();
            $scope.totalItems = $scope.myWorkItemBasketDetails.length;
            $scope.isloading = false;
            $scope.isDataAvailable = true;
        }).error(function () {
            $scope.error = true;
            $scope.isloading = false;
            $scope.isDataAvailable = false;
        });
    }
    
    $('.table').dragableColumns();

});

ImgVisionApp.controller('ModalInstanceAddFilesBasketController', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});