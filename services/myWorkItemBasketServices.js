ImgVisionApp.factory('myWorkItemBasketServices', function ($rootScope,$http, $q, userDetailsServices , urlConstants, $timeout) {

    var deferred = $q.defer();
    var responseData = null;
    var obj = {};
    var url;

    var viewHistoryDisable = true;
    var viewNotesDisable = true;
    var addFilesDisable = true;
    var printDisable = true;
    var emailDisable = true;
    var linkDisable = true;

    var workItemMoved = false;

    var workItemId = null;

    var fileNetId = null;

    obj.getData = function () {

        userDetailsServices.getUserSystemId().then(function (response) {
            
            url = urlConstants.myWorkItemBasket+$rootScope.userDetails.UserName+'/'+response;
            $http.get(url).success(function (response) {
                responseData = response;
                deferred.resolve(responseData);
            }).error(function (error) {
                deferred.reject(responseData);

            });

        });

        return deferred.promise;
    }

    obj.myData = function () {
        return responseData;
    }

    obj.getViewHistoryDisabled = function () {
        return viewHistoryDisable;
    }

    obj.setViewHistoryDisabled = function (val) {
        viewHistoryDisable = val;
        return viewHistoryDisable;
    }

    obj.getViewNotesDisabled = function () {
        return viewNotesDisable;
    }

    obj.setViewNotesDisabled = function (val) {
        viewNotesDisable = val;
        return viewNotesDisable;
    }

    obj.getPrintDisabled = function () {
        return printDisable;
    }

    obj.setPrintDisabled = function (val) {
        printDisable = val;
        return printDisable;
    }

    obj.getEmailDisabled = function () {
        return emailDisable;
    }

    obj.setEmailDisabled = function (val) {
        emailDisable = val;
        return emailDisable;
    }

    obj.getLinkDisabled = function () {
        return linkDisable;
    }

    obj.setLinkDisabled = function (val) {
        linkDisable = val;
        return linkDisable;
    }

    obj.getAddFilesDisabled = function () {
        return addFilesDisable;
    }

    obj.setAddFilesDisabled = function (val) {
        addFilesDisable = val;
        return addFilesDisable;
    }

    obj.getWorkItemMoved = function () {
        return workItemMoved;
    }

    obj.setWorkItemMoved = function (val) {
        workItemMoved = val;
        return workItemMoved;
    }

    obj.getWorkItemId = function () {
        return workItemId;
    }

    obj.setWorkItemId = function (val) {
        workItemId = val;
        return workItemId;
    }

    obj.getFileNetId = function () {
        return fileNetId;
    }

    obj.setFileNetId = function (val) {
        fileNetId = val;
        return fileNetId;
    }

    return obj;
});