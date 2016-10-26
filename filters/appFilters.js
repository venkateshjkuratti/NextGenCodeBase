ImgVisionApp.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

ImgVisionApp.filter('limitInstances', function () {
    return function (data, from, to) {
        return (data || []).slice(from, to);
    };
});

ImgVisionApp.filter('startFrom', function () {
    return function (data, from) {
        return (data || []).slice(from);
    };
});


ImgVisionApp.filter('filterDate', function () {
    return function (data) {
        if (data != null) {
            var splitDate = data.split('T');
            var finalDate = splitDate[0] + " " + splitDate[1];
            return finalDate;
        } else {
            return '';
        }

    };
});

ImgVisionApp.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});

ImgVisionApp.filter('fileType', function () {
    return function (file) {
        if (file != null) {
            var type = file.split('/');
            return type[type.length - 1];
        }

    }
});


ImgVisionApp.filter('formatBytes', function () {
    return function (bytes) {

        return parseFloat(bytes / (1024 * 1024));

    }
});

ImgVisionApp.filter('split', function () {
    return function (input, splitChar, splitIndex) {
        return input.split(splitChar)[splitIndex];
    }
});