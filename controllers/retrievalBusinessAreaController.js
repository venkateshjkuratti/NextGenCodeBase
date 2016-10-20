ImgVisionApp.controller('retrievalBusinessAreaController', function ($rootScope, $scope, $http, $location, $timeout, $window,  $uibModal, urlConstants, commonServices, retrievalResultsServices, userDetailsServices, uploadServices) {

    var selectFields;
    var searchFields;
    var systemID;
    var pageNum = 0;
    $scope.isSelectResultsAvailable = false;
    $scope.isTableVisible = false;
    var businessAreas;
    var selectFields;
    userDetailsServices.getUserSystemId().then(function (response) {
        businessAreas = urlConstants.GetBusinessAreas + $rootScope.userDetails.UserName + '/'+response;
        systemID= response;
        $scope.isBusinessAreasLoading = true;
        $http.get(businessAreas).success(function (response) {
            $scope.searchFieldOptions = response;
            $scope.isBusinessAreaAvailable = true;
            $scope.isBusinessAreasLoading = false;
        }).error(function () {
            $scope.isBusinessAreaAvailable = false;
            $scope.isBusinessAreasLoading = false;
        });
    });

    $scope.isBusinessAreaAvailable = false;

    $scope.tabsHeadDetails = [{
        name: 'Table Grid',
        path: 'partials/retrievalTable.html'
    }];
    $scope.selectFields = function (value) {
        $scope.showSearchOptions = true;
        $scope.isSelectResultsLoading = true;
        $scope.isSelectResultsAvailable = false;
        selectFields = urlConstants.retrievalSearchField +$rootScope.userDetails.UserName + '/'+ systemID +'/';
        $http.get(selectFields + value, {
            cache: false
        }).success(function (response) {
            $scope.selectResults = response;
            $scope.isSelectResultsLoading = false;
            $scope.isSelectResultsAvailable = true;
        }).error(function () {
            $scope.isSelectResultsLoading = false;
            $scope.isSelectResultsAvailable = false;
        });
    }

    $scope.clearSearchFields = function(){
        $('.search-field-boxes input').val('');
        retrievalResultsServices.setExportTabsDisabled(true);
        retrievalResultsServices.setAdminTabsDisabled(true);
        var selectFields = angular.element('.search-field-boxes select');
        var checkFields = angular.element('.check-box');
        angular.forEach(selectFields, function (value, key) {
            var currObj = angular.element(value);
            currObj.val($(currObj).find("option")[0].value);
        });
        angular.forEach(checkFields, function (value, key) {
            var currObj = angular.element(value);
            $(currObj).find("input").removeClass("ng-not-empty").addClass("ng-empty");
            currObj.find("input").prop("checked",false);
        });
        retrievalResultsServices.setRetrievalSearchResults("");
        angular.element(".retrievalResults").hide();
    }

    $scope.searchFields = function (pageNum) {
        angular.element(".retrievalResults").hide();
        angular.element(".noResults").hide();
        commonServices.setNotifyMessage("Retrieval in progress....");
        var postObject = new Object();
        postObject.UserGpid = $rootScope.userDetails.UserName.toString();
        postObject.SystemId = systemID;
        postObject.businessAreaId = $scope.searchFieldText;
        postObject.DocumentClass = "ImageVision";
        postObject.PageNum = pageNum;

        var searchBoxes = angular.element('.search-field-boxes');
        angular.forEach(searchBoxes, function (value, key) {
            var inputVal = "";
            var searchOp = "";
            var currObj = angular.element(value);
            if (currObj.hasClass('text_box')) {
                searchOp = currObj.find('.select.prefix').val();
                inputVal = currObj.find('.input-text').val();
            } else if (currObj.hasClass('date')) {
                searchOp = 1;
                if(currObj.find('.input-date')[0].value != ""){
                 inputVal = currObj.find('.input-date')[0].value + ',' + currObj.find('.input-date')[1].value;   
                }
                else{
                    inputVal = "";
                }
                
            } else if (currObj.hasClass('combo_box')) {
                searchOp = currObj.find('.select.prefix').val();
                var idx = parseInt(currObj.find('.select.form-control').val());
                inputVal = (currObj.find('.select.form-control').val()) ? currObj.find('.select.form-control option[value="'+idx+'"]').text() : '';
            } else if (currObj.hasClass('check_box')) {
                searchOp = 4;
                inputVal = currObj.find('input').hasClass('ng-not-empty') ? 'true' : 'false';
            }
            $scope.selectResults[key].InputValue = inputVal;
            $scope.selectResults[key].SelectedSearchOperator = searchOp;
        });
        postObject.SearchFields = $scope.selectResults;
        uploadServices.setUploadAccordionIndex(1);
        retrievalResultsServices.setLoader(true);
        $rootScope.searchParameters = postObject;
       $http({
            url: urlConstants.retrievalSearchResults,
            dataType: 'json',
            method: 'POST',
            data: postObject,
            headers: {
                "Content-type": "application/json"
            }
        }).success(function (response) {
            retrievalResultsServices.setLoader(false);            
           if(response.Results.DocumentMetaDataList.length>0){
            retrievalResultsServices.setExportTabsDisabled(false);
            var editedHeaders = JSON.parse(JSON.stringify(response.Results.DocumentMetaDataList[0]).replace(/(_+)(?=[(\w#()*\s*]*":)/g, " "));
            retrievalResultsServices.setRetrievalSearchHeaders(editedHeaders);
           }
            retrievalResultsServices.setRetrievalSearchResults(response);
            if(response.RowCount>0){
                angular.element(".retrievalResults").show();
                angular.element(".noResults").hide();
            }
            else{                
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

});