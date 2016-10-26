ImgVisionApp.factory('adminServices', function ($http, $q, $timeout,$rootScope, userDetailsServices, urlConstants) {

    var deferred = $q.defer();
    var responseData = null;
    var obj = {};
    var url;

    var workItemId = null;
    var fileNetId = null;
    var storageRepoId = null;
    var status = null;
    var releaseStatus = null;
    var currentAdminQueueWorkItemDetails = null;
    var adminTabsDisable = true;
    var pageUpdated = false;

    var adminQueueWorkItemsDetails = null;

    var isAccordionDisabledForWebUpload = 'enabled';
    
    var isAccordionDisabledForRetrieval = 'enabled';

    obj.getAdminTreeWorkFlowData = function () {

        userDetailsServices.getUserSystemId().then(function (response) {
            url = urlConstants.adminTreeGetWorkflows+$rootScope.userDetails.UserName+'/'+ response;
            $http.get(url).success(function (response) {
                responseData = response;
                deferred.resolve(responseData);
            }).error(function (error) {
                deferred.reject(responseData);

            });

        });
        
         return deferred.promise;

    };

    obj.adminTreeWorkFlowData = function () {
        return responseData;
    }

    obj.getWorkItemId = function () {
        return workItemId;
    }

    obj.setWorkItemId = function (val) {
        workItemId = val;
        return workItemId;
    }

    obj.getStatus = function () {
        return status;
    }

    obj.setStatus = function (val) {
        status = val;
        return status;
    }

    obj.getReleaseStatus = function () {
        return releaseStatus;
    }

    obj.setReleaseStatus = function (val) {
        releaseStatus = val;
        return releaseStatus;
    }

    obj.getFileNetId = function () {
        return fileNetId;
    }

    obj.setFileNetId = function (val) {
        fileNetId = val;
        return fileNetId;
    }
    obj.getStorageRepoId = function () {
        return storageRepoId;
    }

    obj.setStorageRepoId = function (val) {
        if(val){
            var valArr = val.split('idd_');
            storageRepoId = valArr[1];
            return storageRepoId;
        }
        else
            return;
    }

    obj.getAdminTabsDisabled = function () {
        return adminTabsDisable;
    }

    obj.setAdminTabsDisabled = function (val) {
        adminTabsDisable = val;
        return adminTabsDisable;
    }

    obj.getCurrentAdminQueueWorkItemDetails = function () {
        return currentAdminQueueWorkItemDetails;
    }

    obj.setCurrentAdminQueueWorkItemDetails = function (val) {
        currentAdminQueueWorkItemDetails = val;
        return currentAdminQueueWorkItemDetails;
    }

    obj.getadminPageUpdated = function () {
        return pageUpdated;
    }

    obj.setadminPageUpdated = function (val) {
        pageUpdated = val;
        return pageUpdated;
    }

    obj.getAdminQueueWorkItemsDetails = function () {
        return adminQueueWorkItemsDetails;
    }

    obj.setAdminQueueWorkItemsDetails = function (val) {
        adminQueueWorkItemsDetails = val;
        return adminQueueWorkItemsDetails;
    }
    
    obj.getAccordionDisabledForWebUpload = function () {
        return isAccordionDisabledForWebUpload;
    }

    obj.setAccordionDisabledForWebUpload = function (val) {
        isAccordionDisabledForWebUpload = val;
        return isAccordionDisabledForWebUpload;
    }
    
    obj.getAccordionDisabledForRetrieval = function () {
        return isAccordionDisabledForRetrieval;
    }

    obj.setAccordionDisabledForRetrieval = function (val) {
        isAccordionDisabledForRetrieval = val;
        return isAccordionDisabledForRetrieval;
    }
    
    

    return obj;
});