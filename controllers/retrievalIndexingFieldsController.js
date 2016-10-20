ImgVisionApp.controller('retrievalIndexingFieldsController', function ($rootScope, $scope, $http, $location, $timeout, $window, $uibModal, $log, urlConstants, adminServices, retrievalResultsServices, userDetailsServices, commonServices) {
    $scope.error = false;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 20;
    $scope.hasMorePages = true;
    $scope.itemListOption = [10, 20, 60];
    $scope.itemsPerPageOnSelect = $scope.itemListOption[1];
    $scope.resizeMode = "OverflowResizer";
    $scope.sortOrder = ['business'];
    $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.to = ($scope.currentPage) * $scope.itemsPerPage;
    $scope.createDocumentLists = [{
        'heading': 'Search Criteria',
        'templatePath': 'partials/RetrievalBusinessArea.html',
        'iconImg': 'assets/images/search-chiteria.png'
    }, {
        'heading': 'Search Results',
        'templatePath': 'partials/RetrievalIndexingFields.html',
        'iconImg': 'assets/images/search-result.png'
    }];


    $scope.$watch(function () {
        $scope.isloading = retrievalResultsServices.getLoader();
        return retrievalResultsServices.getRetrievalSearchResults();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            retrievalResultsServices.setRetrievalTabActive(1);
            $scope.searchResults = newValue.Results.DocumentMetaDataList;
            retrievalResultsServices.setLoader(false);
            $scope.isTableVisible = true;
            $scope.totalItems = (newValue.HasMoreItems) ? ($scope.searchResults.length + 1) : $scope.searchResults.length;
            $scope.hasMoreItems = newValue.HasMoreItems;
            $scope.totalText = (newValue.HasMoreItems) ? "more" : $scope.searchResults.length;
            $scope.pageCount = (newValue.HasMoreItems) ? Math.ceil($scope.totalItems / $scope.itemsPerPage) + 1 : Math.ceil($scope.totalItems / $scope.itemsPerPage);
            $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
            $scope.toInim = ($scope.currentPage) * $scope.itemsPerPage;
            $scope.to = $scope.toInim > $scope.totalItems ? $scope.totalItems : $scope.toInim;
        }

    });
    $scope.$watch(function () {
        return retrievalResultsServices.getRetrievalSearchHeaders();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue != null) {
            $scope.searchResultsHeaders = newValue;
        }

    });
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.toInim = ($scope.currentPage) * $scope.itemsPerPage;
        $scope.to = $scope.toInim > $scope.totalItems ? $scope.totalItems : $scope.toInim;
        var oldResults;
        if ($scope.hasMoreItems && $scope.currentPage == $scope.pageCount) {
            $scope.isLoading = true;
            $rootScope.searchParameters.PageNum = $rootScope.searchParameters.PageNum + 1;
            var postObj = $rootScope.searchParameters;
            oldResults = retrievalResultsServices.getRetrievalSearchResults();
            commonServices.setNotifyMessage("Retrieval in progress....");
            $http({
                url: urlConstants.retrievalSearchResults,
                dataType: 'json',
                method: 'POST',
                data: $rootScope.searchParameters,
                headers: {
                    "Content-type": "application/json"
                }
            }).success(function (response) {
                $scope.isLoading = false;
                angular.forEach(response.Results.DocumentMetaDataList, function (item) {
                    oldResults.Results.DocumentMetaDataList.push(item);
                });
                response.Results.DocumentMetaDataList = oldResults.Results.DocumentMetaDataList;
                $scope.searchResults = oldResults.Results.DocumentMetaDataList;
                retrievalResultsServices.setRetrievalSearchResults(response);
                if (response.RowCount > 0) {
                    angular.element(".retrievalResults").show();
                    angular.element(".noResults").hide();
                } else {
                    angular.element(".retrievalResults").hide();
                    angular.element(".noResults").show();
                }



                commonServices.setNotifyMessage("Retrieval complete for the search criteria.");
            }).error(function (response) {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'partials/errorModal.html',
                    controller: function ($scope, $uibModalInstance, error) {
                        retrievalResultsServices.setLoader(false);
                        uploadServices.setUploadAccordionIndex(0);
                        $scope.isTableVisible = false;
                        $scope.errorMessage = error;

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        error: function () {
                            return "Error in Retrieval, please retry.";
                        }
                    }
                });
            });

        }


    };
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1;
    }

    $scope.sortItems = function (value, type) {
        value = value.replace(/\s/g, "_");
        type = type.replace(/\s/g, "_");
        $scope.sort = value;
        if ($scope.orderType != type)
            $scope.orderType = type;
        else
            $scope.orderType = -1;
    }

    $scope.isSetOrder = function (type) {
        type = type.replace(/\s/g, "_");
        return $scope.orderType === type;
    }

    $scope.getItemsPerPage = function (count) {
        $scope.itemsPerPage = count;
        $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.toInim = ($scope.currentPage) * $scope.itemsPerPage;
        $scope.to = $scope.toInim > $scope.totalItems ? $scope.totalItems : $scope.toInim;
    }



    $scope.isQueuesSet = function (id) {
        return $scope.instanceSelected === id;
    }
    $scope.isSet = function (id) {
        return $scope.instanceRow === id;
    }
    $scope.setInstances = function (currRow, documentId, instanceId) {
        if ($scope.instanceRow != documentId) {
            retrievalResultsServices.setDocId(documentId);
            retrievalResultsServices.setFileNetId(documentId);
            retrievalResultsServices.setInstanceId(instanceId);
            retrievalResultsServices.setSelectedRow(currRow);
            $scope.instanceRow = documentId;

            userDetailsServices.getUserSystemId().then(function (response) {
                var systemId = response;
                var linkURL = urlConstants.link + '/' + $rootScope.userDetails.UserName + '/' + systemId + '/' + documentId;
                $http.get(linkURL, {
                        cache: false
                    })
                    .success(function (response) {
                        retrievalResultsServices.setLink(response);
                    })
                    .error(function () {

                    })
            });
            retrievalResultsServices.setAdminTabsDisabled(false);
        } else {
            $scope.instanceRow = -1;
            retrievalResultsServices.setDocId(null);
            retrievalResultsServices.setFileNetId(null);
            retrievalResultsServices.setInstanceId(null);
            retrievalResultsServices.setSelectedRow(null);
            retrievalResultsServices.setAdminTabsDisabled(true);
            $scope.showWorkItemStatusMessage = false;
        }
    }


    $scope.isAdminTabsDisabled = function () {
        return retrievalResultsServices.getAdminTabsDisabled();
    }

    $scope.isExportTabsDisabled = function () {
        return retrievalResultsServices.getExportTabsDisabled();
    }

});