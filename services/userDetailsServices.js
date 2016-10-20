ImgVisionApp.factory('userDetailsServices', function ($http, $q, $location, commonServices) {

    var deferred = $q.defer();
    var responseData = null;
    var obj = {};
    var gpId = null;
    
    var loader = true;
    
    
    var systemIdDeferred = $q.defer();
    var userSystemId = null;


    obj.getUserDetails = function () {

        if ($location.absUrl().indexOf('nextgen') != -1) {

            var cookie = document.cookie;
            var splitCookie = cookie.split('user=');
            gpId = splitCookie[1].substring(0, 8);
        } else {
            gpId = '09138108';
        }

        $http.get('https://nextgendigitalimagingapitest.corp.pep.pvt/api/UserSecurity/GetUsersSystemInfo/' + gpId).success(function (response) {
            responseData = response;
            deferred.resolve(responseData);
        }).error(function (error) {
            commonServices.setNotifyMessage("Error while retrieving user info");
            deferred.reject(responseData);
        });

        return deferred.promise;
    }

    obj.details = function () {
        return responseData;
    }
    
    obj.getLoader = function(){
        return loader
    }
    
    obj.setLoader = function(val){
        loader = val;
        return loader;
    }
    
    obj.getUserSystemId = function(){
        return systemIdDeferred.promise;
    }
    
    obj.setUserSystemId = function(data){
        userSystemId = data;
        systemIdDeferred.resolve(userSystemId);
        return userSystemId;
    }
    
    obj.systemDetails = function () {
        return userSystemId;
    }
    
    

    return obj;
});