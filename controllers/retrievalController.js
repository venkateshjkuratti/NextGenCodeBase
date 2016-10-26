ImgVisionApp.controller('retrievalController', function ($rootScope, $scope, $http, $location, $timeout, $window, $uibModal, $log, commonServices, urlConstants, adminServices, retrievalResultsServices) {
    $scope.isloading = true;
    $scope.error = false;
    $scope.createDocumentLists = [{
        'heading':'Search Criteria',
        'templatePath':'partials/RetrievalBusinessArea.html',
        'iconImg':'assets/images/search-chiteria.png',
        'status': 'enabled'
    },{
        'heading':'Search Results',
        'templatePath':'partials/RetrievalIndexingFields.html',
        'iconImg':'assets/images/search-result.png',
        'status': 'disabled'
    }];
    $scope.documentID = retrievalResultsServices.getDocId();
    $scope.documentType = retrievalResultsServices.getRetrievalTabActive();
    retrievalResultsServices.setAdminTabsDisabled(true);
    retrievalResultsServices.setExportTabsDisabled(true);
    function setadminContentLeftHeight() {
        $('.content-left, .content-right').height($(window).height() - 99);
    }

    $('.table').dragableColumns();

    $(window).resize(function () {
        setadminContentLeftHeight();
    });

    setadminContentLeftHeight();

    $scope.hideContentLeftPanel = function () {
        $('.content-left').toggleClass('swap-content-left');
        $('.content-right').toggleClass('adjust-content-right');
    }
    
    $scope.$watch(function () {
        return adminServices.getAccordionDisabledForRetrieval()
    }, function (newValue, oldValue) {
        if (newValue == 'All') {
            angular.forEach($scope.createDocumentLists, function (obj, index) {
                obj.status = 'enabled'
            });
        }
    });
    
    $scope.$watch(function () {
        return retrievalResultsServices.getRetrievalTabActive();
    }, function (newValue, oldValue) {
        $scope.documentType = newValue;
    });

    $scope.$watch(function () {
        return retrievalResultsServices.getDocId();;
    }, function (newValue, oldValue) {
        $scope.documentID = newValue;
    });

    $scope.isAdminTabsDisabled = function () {
        return retrievalResultsServices.getAdminTabsDisabled();
    }

    $scope.isExportTabsDisabled = function () {
        return retrievalResultsServices.getExportTabsDisabled();
    }


    $scope.showEmailModal = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/email.html',
            controller: 'ModalInstanceEmailController',
            resolve: {
                items: function () {
                    return retrievalResultsServices.getDocId();
                }
            }
        });

    };
    $scope.showAddPageModal = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/addPage.html',
            controller: 'ModalInstanceAddFilesController',
            resolve: {
                items: function () {
                    return retrievalResultsServices.getDocId();
                }
            }
        });

    };
    $scope.copyLink = function(){
            $scope.link = retrievalResultsServices.getLink();
            commonServices.setNotifyMessage("Link is copied.");
    }
    $scope.showViewHistory = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/viewHistory.html',
            controller: 'ModalInstanceViewHistoryController',
            resolve: {
                items: function () {
                    return retrievalResultsServices.getInstanceId();
                },
                docId: function () {
                    return retrievalResultsServices.getDocId();
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
                    return retrievalResultsServices.getInstanceId();
                },
                docId: function(){
                   return retrievalResultsServices.getDocId();  
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
                     return retrievalResultsServices.getInstanceId();
                },
                docId: function(){
                   return retrievalResultsServices.getDocId();  
                }
            }
        });
        
      modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
        

    };

      $scope.exportToExcel = function(){

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/exportExcelModal.html',
            controller: 'ModalInstanceExportExcelController',
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
    }

});