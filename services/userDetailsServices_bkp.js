ImgVisionApp.factory('userDetailsServices', function ($http, $q, $location, userSystemInfoServices) {

    var deferred = $q.defer();
    var responseData = null;
    var obj = {};
    var gpId = null;


    obj.getUserDetails = function () {

        userSystemInfoServices.getUserSystemId().then(function (response) {

            var userSystemId = userSystemInfoServices.systemDetails();
            console.log(userSystemId);
            var gpId = userSystemInfoServices.gpId;

            $http.get('https://nextgendigitalimagingapitest.corp.pep.pvt/api/UserAccount/RegisterPrincipal/' + gpId + '/' + userSystemId).success(function (response) {
                responseData = response;
                deferred.resolve(responseData);
            }).error(function (error) {
                deferred.reject(responseData);
            });

        });

        return deferred.promise;
    }

    obj.details = function () {
        return responseData;
    }

    return obj;
});