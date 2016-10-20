var ImgVisionApp = angular.module('imgVisionApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'ngCookies', 'ngTableResize', 'pascalprecht.translate']);

ImgVisionApp.config(function($routeProvider, $httpProvider, $locationProvider, $translateProvider) {

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json, text/html";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json, text/html";

    $translateProvider.translations('en', translations_en);
    $translateProvider.translations('ru', translations_ru);

    $translateProvider.preferredLanguage('en');

    $routeProvider.when('/home', {
            templateUrl: 'partials/myWorkItemBasket.html',
            controller: "myWorkItemBasketController"
        })
        .when("/admin", {
            templateUrl: "partials/admin.html",
            controller: "adminController"
        }).when("/workItemView/:docTypeId/:instanceId/:storageRepoId/:type", {
            templateUrl: "partials/myWorkItemView.html",
            controller: "myWorkItemViewController"
        }).when("/retrieval", {
            templateUrl: "partials/retrieval.html",
            controller: "retrievalController"
        }).when("/upload/:copyDoc?", {
            templateUrl: "partials/upload.html",
            controller: "webUploadController"
        }).when("/reports", {
            templateUrl: "partials/reports.html",
            controller: ""
        }).when("/dashboard", {
            templateUrl: "partials/dashboard.html",
            controller: "dashboardController"
        }).when("/trafficcop", {
            templateUrl: "TrafficCop/trafficcop.html",
            controller: "trafficcopController"
        }).otherwise('/home');
});



ImgVisionApp.controller('menuController', function($scope, $location, uploadServices) {
    $scope.getClass = function(path) {
        //uploadServices.setUploadAccordionIndex(0);
        $scope.$on('$locationChangeStart', function() {
            uploadServices.setUploadAccordionIndex(0);
        });

        return ($location.path().substr(0, path.length) === path) ? 'is-active' : '';
    }
    $scope.isShowMenu = ($location.path().indexOf('workItemView') > -1) ? false : true;
    $scope.getArrow = function(path) {
        if ($location.path().substr(0, path.length) === path) {
            return true;
        }
    }


});

ImgVisionApp.constant('datepickerPopupConfig', {
    datepickerPopup: "MMM d, yyyy",
    closeOnDateSelection: true,
    appendToBody: false,
    showButtonBar: false
})

ImgVisionApp.constant('datepickerConfig', {
    formatDay: 'dd',
    formatMonth: 'MMMM',
    formatYear: 'yyyy',
    formatDayHeader: 'EEE',
    formatDayTitle: 'MMMM yyyy',
    formatMonthTitle: 'yyyy',
    datepickerMode: 'day',
    minMode: 'day',
    maxMode: 'year',
    showWeeks: false,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null
})