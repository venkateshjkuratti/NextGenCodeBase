ImgVisionApp.controller('webUploadController', function ($scope, $http, $rootScope, $timeout, $uibModal, $routeParams, urlConstants, adminServices, uploadServices, userDetailsServices, commonServices) {
    $scope.createDocumentLists = [{
        'heading': 'Business Area and Document Type',
        'templatePath': 'partials/CreateDocumentBusinessArea.html',
        'iconImg': 'assets/images/business-area.png',
        'status': 'enabled'
    }, {
        'heading': 'Indexing Fields',
        'templatePath': 'partials/CreateDocumentIndexingFields.html',
        'iconImg': 'assets/images/index.png',
        'status': 'disabled'
    }, {
        'heading': 'Select file to upload',
        'templatePath': 'partials/CreateDocumentSelectFiles.html',
        'iconImg': 'assets/images/upload.png',
        'status': 'disabled'
    }, {
        'heading': 'Upload Options',
        'templatePath': 'partials/CreateDocumentUploadOptions.html',
        'iconImg': 'assets/images/options.png',
        'status': 'disabled'
    }];

    $(":file").filestyle();

    $scope.isFormValid = function () {
        if ($scope.webUploadForm.$invalid) {
            return true;
        } else {
            return false;
        }
    }

    $scope.triggerBrowse = function () {
        $('.browse-file').trigger('click');
    }



    $scope.$watch(function () {
        return adminServices.getAccordionDisabledForWebUpload()
    }, function (newValue, oldValue) {
        if (newValue == 'All') {
            angular.forEach($scope.createDocumentLists, function (obj, index) {
                obj.status = 'enabled'
            });
        }
    });


    /* Create Business Area Code */

    $scope.user = {};
    $scope.user.uploadOptionsQueueOnSelect = null;
    $scope.user.selectedBusinessArea = null;
    $scope.user.selectedDocumentTypeOptions = null;
    $scope.user.sendToNotification = null;

    var initialFromData = $scope.user;

    $scope.isBusinessAreaAvailable = false;
    $scope.isDocumentTypeOptions = false;

    $scope.isBusinessAreaLoaded = true;

    $scope.isFormSubmitted = false;


    var businessAreas;
    var documentTypes;
    var indexingFields;
    var documentTypeInfo;
    var userPerferences;
    var businessAreasTypeName;
    var documentTypeName;
    var indexFields = [];
    var systemID;
    var userPrefWorkFlow;
    userDetailsServices.getUserSystemId().then(function (response) {
        systemID = response;
        businessAreas = urlConstants.GetBusinessAreas + $rootScope.userDetails.UserName + '/' + systemID;
        documentTypes = urlConstants.GetDocumentTypes + $rootScope.userDetails.UserName + '/' + systemID;
        userPerferences = urlConstants.getUserPreferences + $rootScope.userDetails.UserName + '/' + systemID;
        $http.get(businessAreas).success(function (response) {
            $scope.isBusinessAreaLoaded = false;
            $scope.businessAreaOptions = response;
            $scope.isBusinessAreaAvailable = true;
        }).error(function () {
            $scope.isBusinessAreaAvailable = false;
        });
        getUserPerferenceDetails();
    });

    function getUserPerferenceDetails() {
        $http.get(userPerferences).success(function (response) {
            var data = response;
            $timeout(function () {
                //checks whether the checks are enabled or disabled
                angular.forEach(data, function (item) {               
                    switch (item.PreferenceTitle) {                   
                        case 'Send to Workflow':
                            $scope.user.sendToWorkflow = (item.PreferenceValue === "true");
                            userPrefWorkFlow = (item.PreferenceValue === "true");
                            $scope.isSendToWorkFlowEnabled = item.CanOverride;
                            break;
                        case 'Email Notification':
                            $scope.user.sendToNotification = (item.PreferenceValue === "true");
                            $scope.isSendToNotificationEnabled = item.CanOverride;
                            break;
                    }
                });
            });
        }).error(function () {
            commonServices.setNotifyMessage("Error in loading user preferences.")
        });
    }

    $scope.getSendToWorkFlow = function () {
        $scope.user.sendToWorkflow = !$scope.user.sendToWorkflow;
    }

    $scope.getSendToNotification = function () {
        $scope.user.sendToNotification = !$scope.user.sendToNotification;
    }

    $scope.$watch(function () {
        return $scope.user.sendToWorkflow
    }, function (newValue, oldValue) {
        uploadServices.setIndexingNotFieldsRequried(newValue);
    });
    
    $scope.$watch(function(){
        return $scope.user.inputFile
    }, function(newValue, oldValue){
        if(newValue != oldValue)
            $scope.isFileExist=(newValue!=undefined);
    });
    
    $scope.changeBusinessArea = function (data, name) {
        getDocumentTypes(data);
        businessAreasTypeName = name;
        $scope.selectResults = [];
    }


    function getDocumentTypes(val) {
        $scope.isDocumentTypeOptions = true;
        $http.get(documentTypes + '/' + val).success(function (response) {
            $scope.documentTypeOptions = response;
            $scope.isDocumentTypeOptions = false;
            adminServices.setAccordionDisabledForWebUpload('All');


        }).error(function () {
            $scope.isDocumentTypeOptions = false;
        });
    }

    $scope.isSelectResultsLoading = false;
    $scope.isSelectResultsAvailable = false;
    var getFieldsUrl = '';
    $scope.changeDocumentTypeOptions = function (data, name) {
        if(typeof data == "undefined")
            return false;
        $scope.selectResults = [];
        $scope.isSelectResultsLoading = true;
        uploadServices.setUploadAccordionIndex(1);
        documentTypeName = name;
        //Api for both Indexing fields and Queues in Upload options tab
        
        getFieldsUrl = ($routeParams.copyDoc)?urlConstants.GetIndexingFields + $rootScope.userDetails.UserName + '/' + systemID + '/' + data+'/'+$routeParams.copyDoc : urlConstants.GetDocumentTypeInfo + $rootScope.userDetails.UserName + '/' + systemID + '/' + data;
        $http.get(getFieldsUrl).success(function (response) {
            $scope.selectResults = response;
            $scope.indexingFields = response.IndexingFields;
            $scope.isSelectResultsLoading = false;
            $scope.isSelectResultsAvailable = true;
            commonServices.setNotifyMessage('Data Not Available');

            if (response == null || response == []) {
                commonServices.setNotifyMessage('Data Not Available');
            } else {
                commonServices.setNotifyMessage('');
            }

            $timeout(function () {
                if ($scope.user.sendToWorkflow == 'true' && $scope.selectResults.StartingQueueOptions.length == 0) {
                    uploadServices.setIndexingNotFieldsRequried(false);
                } else if ($scope.user.sendToWorkflow == 'true') {
                    uploadServices.setIndexingNotFieldsRequried(true);
                } else {

                }
                if ($scope.selectResults.DefaultStartingQueue != null) {
                    $scope.documentQueue = [];
                    $scope.documentQueue.push($scope.selectResults.DefaultStartingQueue);
                    $scope.documentQueue = $scope.documentQueue.concat($scope.selectResults.StartingQueueOptions);
                    $scope.user.uploadOptionsQueueOnSelect = $scope.selectResults.DefaultStartingQueue;
                    $scope.user.sendToWorkflow = userPrefWorkFlow;
                } else {
                    $scope.documentQueue = [];
                    $scope.documentQueue = $scope.selectResults.StartingQueueOptions;
                    $scope.user.sendToWorkflow = false;
                }
            }, 100);
        }).error(function () {
            $scope.isSelectResultsLoading = false;
            $scope.isSelectResultsAvailable = true;
        });
    }

    $scope.$watch(function () {
        return uploadServices.getFiletoUpload();
    }, function (newValue, oldValue) {
        angular.element(".fileType").text("");
        if (newValue === 'invalid') {
            $scope.uploadedFileList = [];
            commonServices.setNotifyMessage('File Size is greater than limited size');
        } else if (newValue == null) {
            $scope.uploadedFileList = [];
        } else {
            $scope.uploadedFileList = [];
    
            var validFormats = ["application/pdf"];
            if(validFormats.indexOf(newValue.type)== -1){                
                angular.element(".fileType").text('Error: File type other than PDF selected, unable to process request. Please remove and add only PDF document.');
                return false;
            }
            $scope.uploadDocument = newValue;
            $scope.uploadedFileList.push($scope.uploadDocument);
            commonServices.setNotifyMessage('');
        }
    });

    $scope.deleteFile = function (index) {
        $scope.uploadedFileList.splice(index, 1);
        $('.choose-file input').val('');
    }

    $scope.addtoExistingBatch = true;
    $scope.resetForm = function () {
        $scope.webUploadForm.$setPristine();
        $scope.uploadedFileList = [];
        $scope.user = {};
        getUserPerferenceDetails();
        $scope.isSelectResultsAvailable = false;
    }
    
    
    var BYTES_PER_CHUNK = 1024 * 1024;
    $scope.submitForm = function () {
        var createObj = {};
        var fd = new FormData();
        $scope.isFormSubmitted = true;
        var searchBoxes = angular.element('.search-field-boxes');
            angular.forEach(searchBoxes, function (value, key) {
                var inputVal = "";
                var searchOp = "";
                var currObj = angular.element(value);
                if (currObj.hasClass('text_box')) {
                    inputVal = currObj.find('.input-text').val();
                } else if (currObj.hasClass('date')) {
                    inputVal = currObj.find('.input-date').val();
                } else if (currObj.hasClass('combo_box')) {
                    var idx = currObj.find('.select.form-control').val();
                    inputVal = (currObj.find('.select.form-control').val()) ? currObj.find('.select.form-control option[value="'+idx+'"]').text() : '';
                } else if (currObj.hasClass('check_box')) {
                    inputVal = currObj.find('input').hasClass('ng-not-empty') ? 'true' : 'false';
                }
                $scope.indexingFields[key].ValueAsString = inputVal;
            });
        $scope.configBlob = {
            data: $scope.uploadDocument,
            uniqueId: new Date().getTime(),
            start: 0,
            end: BYTES_PER_CHUNK,
            size: $scope.uploadDocument.size,
            pause: false
        };

        fd.append("image", $scope.configBlob.data.slice($scope.configBlob.start, $scope.configBlob.end), $scope.uploadDocument.name);
        
        angular.forEach($scope.documentTypeOptions,function(item){
            if(item.Id == $scope.user.selectedDocumentTypeOptions)
                documentTypeName = item.Name;
        })
        createObj.BusinessAreaId = $scope.user.selectedBusinessArea;
        createObj.DocTypeId = $scope.user.selectedDocumentTypeOptions;
        createObj.AbbyyDocId = null;
        if($scope.user.uploadOptionsQueueOnSelect)
            createObj.QueueID = $scope.user.uploadOptionsQueueOnSelect.QueueId;
        createObj.DocumentType = documentTypeName;
        createObj.DocumentSource = "Web_Upload";
        createObj.indexFields = $scope.indexingFields;
        createObj.DocumentStream = null;
        createObj.DocumentName = $scope.uploadDocument.name;
        createObj.SendToWorkflow = $scope.user.sendToWorkflow;
        createObj.ConvertToPDF = null;
        createObj.SendEmailNotification = $scope.user.sendToNotification;
        createObj.UserGpid = $rootScope.userDetails.UserName;
        createObj.SystemId = systemID;

        fd.append("CreateDocumentRequest", angular.toJson(createObj));

        userDetailsServices.setLoader(true);

        $http({
            url: urlConstants.createDocument,
            method: 'POST',
            data: fd,
            headers: {
                "Content-type": undefined
            },
            transformRequest: angular.identity
        }).success(function (response) {

            if ($scope.configBlob.end < $scope.configBlob.size && !$scope.configBlob.pause) {
                $scope.configBlob.start = $scope.configBlob.end;
                $scope.configBlob.end += BYTES_PER_CHUNK;
                fd.append("file", $scope.configBlob.data.slice($scope.configBlob.start, $scope.configBlob.end), $scope.uploadDocument.name);
            } else {
                $scope.isFormSubmitted = false;
                if ($scope.user.sendToWorkflow) {
                    commonServices.setNotifyMessage("Doc ID : " + response.DocumentId + " created. Storage Rep ID : "+response.StorageRepositoryId+". Doc submitted to Workflow, Workitem ID : " + response.WorkItemId);
                } else {
                    commonServices.setNotifyMessage("Doc ID : " + response.DocumentId + " created. Storage Rep ID : "+response.StorageRepositoryId+".");
                }
                $scope.resetForm();
                userDetailsServices.setLoader(false);
                $scope.isSelectResultsAvailable = false;

            }


        }).error(function (response) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'partials/errorModal.html',
                controller: function ($scope, $uibModalInstance, error) {
                    $scope.errorMessage = error;

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                },
                resolve: {
                    error: function () {
                        return response.Message;
                    }
                }
            });

            $scope.isFormSubmitted = false;
            //If web upload results in error, dont clear fields and values
            userDetailsServices.setLoader(false);
        });


    }

});