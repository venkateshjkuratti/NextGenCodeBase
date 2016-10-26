ImgVisionApp.controller('headerController', function ($scope, $rootScope, $window, $location, $http, $log, $uibModal, $translate, urlConstants, userDetailsServices, commonServices) {
    /*Sign out functionality --- START*/
    var IDLE_TIMEOUT = 20; //seconds
    var _idleSecondsCounter = 0;
    document.onclick = function () {
        _idleSecondsCounter = 0;
    };
    document.onmousemove = function () {
        _idleSecondsCounter = 0;
    };
    document.onkeypress = function () {
        _idleSecondsCounter = 0;
    };
    window.setInterval(CheckIdleTime, 60000);

    function CheckIdleTime() {
        _idleSecondsCounter++;
        if (_idleSecondsCounter >= IDLE_TIMEOUT) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'partials/errorModal.html',
                controller: function ($scope, $uibModalInstance, error) {
                    localStorage.clear();
                    $scope.errorMessage = error;
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                        eraseCookie("SMSESSION");
                        createCookie("SMSESSION", "LOGGEDOFF", 0, ".pep.pvt");
                        createCookie("user", "", 0, ".pep.pvt");
                        createCookie("loggedin", "false", 0, ".pep.pvt");
                        $window.location.href = 'https://nextgendigitalimaginguitest.corp.pep.pvt/index.html';
                    };
                },
                resolve: {
                    error: function () {
                        return "User Session timed out, please re-login.";
                    }
                }
            });
        }
    }

    function createCookie(name, value, days, domain) {
        var domain_string = domain ? ("; domain=" + domain) : '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/" + domain_string;
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name, "", -1);
    }
    /*Sign out functionality --- END*/
    var userInfo = null;

    $scope.ishomeLoader = function () {
        return userDetailsServices.getLoader();
    }
    userDetailsServices.getUserDetails().then(function (response) {

        $scope.userSystemInfo = userDetailsServices.details();

        $scope.userSystemLanguage = [{
            lang: 'English',
            value: 'en'
        }, {
            lang: 'Russia',
            value: 'ru'
        }]


        if (!localStorage.getItem("systemsLength") && $scope.userSystemInfo.ImagingSystems.length > 1) {

            localStorage.setItem("systemsLength", $scope.userSystemInfo.ImagingSystems.length);
            localStorage.setItem("gpid", $scope.userSystemInfo.UserGpid);
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                backdrop: 'static',
                keyboard: false,
                templateUrl: 'partials/userSystemInfo.html',
                controller: 'ModalInstanceUserSystemInfoController',
                resolve: {
                    userSystem: function () {
                        return $scope.userSystemInfo;
                    }
                }
            });

            modalInstance.result.then(function (systemData) {

                $translate.use(systemData.systemLanguage);

                $http.get('https://nextgendigitalimagingapitest.corp.pep.pvt/api/UserSecurity/RegisterPrincipal/' + $scope.userSystemInfo.UserGpid + '/' + systemData.systemId).success(function (response) {

                    $rootScope.userDetails = response;

                    userDetailsServices.setLoader(false);
                    userDetailsServices.setUserSystemId(systemData.systemId);

                }).error(function (error) {
                    userDetailsServices.setLoader(false);
                    commonServices.setNotifyMessage("Error while registering user");
                });

            }, function () {

            });

        } else {
            var systemID = (localStorage.getItem("systemId")) ? localStorage.getItem("systemId") : $scope.userSystemInfo.ImagingSystems[0].SystemId;
            $http.get('https://nextgendigitalimagingapitest.corp.pep.pvt/api/UserSecurity/RegisterPrincipal/' + $scope.userSystemInfo.UserGpid + '/' + systemID).success(function (response) {
                $rootScope.userDetails = response;

                userDetailsServices.setLoader(false);
                userDetailsServices.setUserSystemId(systemID);

            }).error(function (error) {
                userDetailsServices.setLoader(false);
                commonServices.setNotifyMessage("Error while registering user");
            });

        }


    });


    $scope.toogleLang = function () {
        console.log($translate.use());
        $translate.use() === 'en' ? $translate.use('ru') : $translate.use('en');

    }

    $scope.showUserPreferences = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/userPreferences.html',
            controller: 'ModalInstanceUserPreferenceController',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

    };
    $scope.isWorkItem = ($location.path().indexOf('workItemView') > -1) ? true : false;
    $scope.logOut = function () {
        var userGPID = $rootScope.userDetails.UserName;
        userDetailsServices.getUserSystemId().then(function (response) {
            logOutURL = urlConstants.logOut + '/' + userGPID + '/' + response;
            $http({
                url: logOutURL,
                method: 'GET',
            }).success(function (response) {
                localStorage.clear();
                var landingUrl = "http://" + $window.location.host + "/#/" + "/home";
                $window.location.href = landingUrl;
            }).error(function (response) {
                $log.error(status);
            })

        });

    }

});