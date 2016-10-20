ImgVisionApp.controller('ModalInstanceUserSystemInfoController', function ($scope, $uibModalInstance, userSystem) {


    $scope.systemData = userSystem;

    var systemId;

    var systemData = {};
    $scope.languageData = [];


    $scope.getSelectedSystem = function (id) {
        $scope.languageData = [];
        localStorage.setItem("systemId", id);
        systemId = id;
        angular.forEach($scope.systemData.ImagingSystems, function (val) {

            if (val.SystemId == id) {

                angular.forEach(val.Languages, function (lang) {

                    if (val.Languages.length < 2) {
                        var transLang = lang.toLowerCase();
                       // console.log(transLang);
                        systemData.systemId = systemId;
                        systemData.systemLanguage = transLang.substring(0, 2);
                        $uibModalInstance.close(systemData);
                    } else {
                        var transLang = lang.toLowerCase();
                        $scope.languageData.push({
                            'lang': lang,
                            'value': transLang.substring(0, 2)
                        });
                    }

                });
            }

        });

    }

    $scope.getSelectedLanguage = function (lang) {

        systemData.systemId = systemId;
        systemData.systemLanguage = lang;
        $uibModalInstance.close(systemData);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});