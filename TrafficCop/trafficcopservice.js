ImgVisionApp.factory('trafficcopService', function ($rootScope,$http, $q, userDetailsServices , urlConstants, $timeout) {

var deferred = $q.defer();
    var responseData = null;
    var obj = {};
    var url;

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