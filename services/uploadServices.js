ImgVisionApp.service('uploadServices', function ($http, $q, $filter, userDetailsServices, urlConstants) {

    var isLoading = false;

    var isUploadSuccess = null;

    var message = '';

    var newFileNetId = null;

    var webUplaodDocumentType = null;

    var accordionIndex = 0;

    var indexingNotFieldsRequried = false;

    var files = null;
    var fileSizeUrl;
    var fileSize;

    userDetailsServices.getUserSystemId().then(function (response) {

        var details = userDetailsServices.details();
        fileSizeUrl = urlConstants.getFileSize + details.UserGpid + '/' + response;

        $http.get(fileSizeUrl).success(function (response) {
            fileSize = parseFloat(response.SizeLimit);
        }).error(function () {

        });

    });

    var createObj = {};
    var fd = new FormData();
    var BYTES_PER_CHUNK = 1024 * 1024;




    this.uploadFileToUrl = function (file, uploadUrl) {

        var configBlob = {
            data: file,
            uniqueId: new Date().getTime(),
            start: 0,
            end: BYTES_PER_CHUNK,
            size: file.size,
            pause: false
        };

        var fd = new FormData();
        fd.append('file', configBlob.data.slice(configBlob.start, configBlob.end), file.name);

        isLoading = true;

        $http({
                url: uploadUrl,
                method: 'POST',
                data: fd,
                headers: {
                    "content-type": undefined
                },
                transformRequest: angular.identity
            }).success(function (response) {

                if (configBlob.end < configBlob.size && !configBlob.pause) {
                    configBlob.start = configBlob.end;
                    configBlob.end += BYTES_PER_CHUNK;
                    fd.append("file", configBlob.data.slice(configBlob.start, configBlob.end), uploadDocument.name);
                } else {
                    isLoading = false;
                    isUploadSuccess = true;
                    message = "File uploaded successfully";
                    newFileNetId = response;
                }

            })
            .error(function () {
                isLoading = false;
                isUploadSuccess = true;
                message = "Some error occured during the upload. Please try again"
            });
    };

    this.getLoading = function () {
        return isLoading;
    }

    this.uploadSuccess = function () {
        return isUploadSuccess;
    }

    this.resetUpload = function () {
        isUploadSuccess = false;
        return isUploadSuccess;
    }

    this.showMessage = function () {
        return message;
    }

    this.getNewFileNetId = function () {
        return newFileNetId;
    }

    this.getWebUplaodDocumentType = function () {
        return webUplaodDocumentType;
    }

    this.setWebUplaodDocumentType = function (val) {
        webUplaodDocumentType = val;
        return webUplaodDocumentType;
    }


    this.getUploadAccordionIndex = function () {
        return accordionIndex;
    }

    this.setUploadAccordionIndex = function (val) {
        accordionIndex = val
        return accordionIndex;
    }

    this.getIndexingNotFieldsRequried = function () {
        return indexingNotFieldsRequried;
    }

    this.setIndexingNotFieldsRequried = function (val) {
        indexingNotFieldsRequried = val
        return indexingNotFieldsRequried;
    }

    this.setFiletoUpload = function (val) {

        var inputFileSize = $filter('formatBytes')(val.size);
        if (inputFileSize < fileSize) {
            files = val;
        } else {
            files = 'invalid';
        }
        return files;
    }

    this.getFiletoUpload = function () {
        return files;
    }

});