ImgVisionApp.controller('adminController', function ($scope, $rootScope, $http, $timeout, $window, $uibModal, urlConstants, adminServices, userDetailsServices, commonServices) {

    var adminWorkFlow;
    var adminQueueDetailsUrl;
    var adminQueueWorkItemsUrl;
    var getDocumentTypes;
    var updateDocumentType;
    var reAssignWorkItem;
    var alterItemGpIds;
    var alterWorkItem;
    var activateWorkItem;
    var deleteWorkItem;
    var reAssignItemGpIds;
    var saveUserPreferences;
    var isAdminChange = false;
    var workflowID = null;
    var adminQueueID;
    var queueID = null;
    var processActivityID;
    var systemId;
    var selectedAdminWorkFlowQueue;

    $scope.isTableVisible = false;
    $scope.isAdminTreeLoading = true;
    $scope.workStatusCount = null;
    $scope.isWorkStatusActive = false;
    $scope.error = false;
    $scope.activeDropDown = null;
    $scope.isCount = false;
    $scope.isAssignSubmitDisabled = true;
    $scope.isWorkItems = false;
    $scope.isActivateEnabled = false;
    $scope.isSuspendEnabled = false;
    $scope.isAlterEnabled = false;
    $scope.isDeleteEnabled = false;
    $scope.isSingleSelect = false;
    $scope.isOneRowSelected = false;
    $scope.showWorkItemStatusMessage = false;
    $scope.workFlowNil = false;
    $scope.isApiCallsSuccess = false;
    $scope.fullname = false;
    $scope.gpid = false;

    $scope.adminEmitter = {
        alter: 'alter',
        reAssign: 're-assign',
        releaseStatus: 'The selected work Item is already Released',
        apiCallSuccess: 'Changes has been Updated'
    }

    adminServices.getAdminTreeWorkFlowData().then(
        function () {
            $scope.adminTreeWorkFlowDetails = adminServices.adminTreeWorkFlowData();
            if ($scope.adminTreeWorkFlowDetails.length > 0)
                $scope.getAdminQueues(0, $scope.adminTreeWorkFlowDetails[0].ID);
            else
                $scope.workFlowNil = true;
            $scope.isAdminTreeLoading = false;
            $timeout(function () {
                $('.content-left').height($(window).height() - 260);
                $('.admin-tree ul.parent .child').height($(window).height() - 430);
            }, 0);
        },
        function () {
            $scope.isAdminTreeLoading = false;
        });


    userDetailsServices.getUserSystemId().then(function (response) {
        systemId = response;
        adminWorkFlow = urlConstants.adminTreeGetWorkflows + $rootScope.userDetails.UserName + '/' + response;
        adminQueueDetailsUrl = urlConstants.adminTreeGetWorkQueues + $rootScope.userDetails.UserName + '/' + response;
        adminQueueWorkItemsUrl = urlConstants.adminTreeGetWorkItems + $rootScope.userDetails.UserName + '/' + response;
        getDocumentTypes = urlConstants.getDocumentTypes;
        updateDocumentType = urlConstants.updateDocumentType;
        reAssignWorkItem = urlConstants.reAssignWorkItem;
        activateWorkItem = urlConstants.activateWorkItem;
        deleteWorkItem = urlConstants.deleteWorkItem;
        reAssignItemGpIds = urlConstants.reAssignItemGpIds;
        alterItemGpIds = urlConstants.alterItemGpIds;
        alterWorkItem = urlConstants.alterWorkItem;
        getUserPreferences = urlConstants.getUserPreferences + $rootScope.userDetails.UserName + '/' + response;
        saveUserPreferences = urlConstants.saveUserPreferences;
        $http.get(getUserPreferences).success(function (response) {
            var data = response;
            $timeout(function () {
                //checks whether the checks are enabled or disabled
                angular.forEach(data, function (item) {
                    if (item.PreferenceTitle == 'Username display') {
                        $scope.fullname = (item.PreferenceValue === "true");
                        $scope.gpid = (item.PreferenceValue === "false");
                    }
                });
            });
        }).error(function () {
            commonServices.setNotifyMessage("Error in loading user preferences.")
        });

    });

    $scope.sortItems = function (value, type) {
        $scope.sort = value;
        if ($scope.orderType != type)
            $scope.orderType = type;
        else
            $scope.orderType = -1;
    }

    $scope.isSetOrder = function (type) {
        return $scope.orderType === type;
    }

    $scope.sortDynamicItems = function (value, type) {
        $scope.dynamicSort = value;
        if ($scope.orderDynamicType != type)
            $scope.orderDynamicType = type;
        else
            $scope.orderDynamicType = -1;
    }

    $scope.isSetDynamicOrder = function (type) {
        return $scope.orderDynamicType === type;
    }


    $scope.isOpenQueue = function (queue) {
        return $scope.activeQueueIndex === queue;
    }

    $scope.getAdminQueues = function (queue, itemId) {
        $scope.error = false;
        $scope.adminQueueDetails = null;
        $scope.instanceSelected = -1;
        getAdminQueueDetails(queue);
        if ($scope.adminTreeQueueId != itemId) {
            $scope.adminTreeQueueId = itemId;
        }
        if ($scope.activeQueueIndex != queue)
            $scope.activeQueueIndex = queue;
        else
            $scope.activeQueueIndex = -1;

    }

    /* getting Queue details */
    function getAdminQueueDetails(queue) {
        selectedAdminWorkFlowQueue = queue;
        $scope.adminQueueDetails = adminServices.adminTreeWorkFlowData()[queue].UserWorkflowQueues;
        setadminContentLeftHeight();
    }

    $scope.isAdminTreeQueueLoaded = function (id) {
        return $scope.adminTreeQueueId === id;
    }

    /* getting Individual Queue details */
    $scope.getAdminQueueWorkItemsDetails = function (WorkflowId, id, totalCount, activeCount, suspendedCount, assignedCount, unassignedCount) {

        $scope.isWorkItems = false;
        workflowID = WorkflowId;
        queueID = id;
        $scope.clearAlertMessages();
        $scope.isloading = true;
        $scope.isTableVisible = false;
        $scope.gpIds = [];
        $scope.selectedRows = [];
        setMenuStatus();
        commonServices.setNotifyMessage("");

        $http.get(adminQueueWorkItemsUrl + '/' + WorkflowId + '/' + id + '/' + true).success(function (response) {

            $scope.adminQueueWorkItemsDetails = response;
            $scope.dynamicHeaders = JSON.parse(JSON.stringify(response[0].DynamicProperties).replace(/(_+)(?=[(\w#()*\s*]*":)/g, " "));
            $scope.dynamicColumnVals = [];
            angular.forEach(response, function (item) {
                $scope.dynamicColumnVals.push(item.DynamicProperties);
            });
            $scope.isWorkItems = ($scope.adminQueueWorkItemsDetails.length > 0);
            if (response.length == 0) {
                $scope.isloading = false;
                $scope.error = true;
                $scope.isCount = false;
                return false;
            }
            $timeout(function () {
                $scope.isloading = false;
                $scope.isTableVisible = true;
                $scope.isCount = true;
                commonServices.setNotifyMessage("Workitem loaded.");

            }, 1000);
            //shows the 'change has been updated' dialog box after the page refresh
            if (isAdminChange) {
                $timeout(function () {
                    commonServices.setNotifyMessage("Changes has been updated.")
                    isAdminChange = false;
                }, 500);
            }
            getAdminGridColumnOrder(WorkflowId, id);
            adminServices.setAdminQueueWorkItemsDetails(response);
            localStorage.setItem('getAdminQueueWorkItemsDetails', JSON.stringify(response));

            var width;
            $timeout(function () {
                tableColumnWidth();
            }, 1000);


        }).error(function () {
            $scope.isloading = false;
            $scope.error = true;
            $scope.isCount = false;
        });

        //highlighting the selected queues
        if ($scope.instanceSelected != id) {
            $scope.instanceSelected = id;
        }

        //getting the work status counts

        $scope.isWorkStatusActive = true;
        adminServices.setCurrentAdminQueueWorkItemDetails(adminQueueWorkItemsUrl + '/' + WorkflowId + '/' + id + '/' + true);

    }

    $scope.getTableColumnWidth = function () {
        $timeout(function () {
            tableColumnWidth();
        }, 100);
    }

    function tableColumnWidth() {
        $('.admin-wrapper table th').each(function (index) {
            width = $('.admin-wrapper table th:eq(' + index + ')').find('.text').width();
            $('.admin-wrapper table th:eq(' + index + ')').css('width', width + 35 + 'px');

            $('.admin-wrapper table tr').each(function (newIndex) {
                $('.admin-wrapper table tr:eq(' + newIndex + ') td:eq(' + index + ') ').css('width', width + 35 + 'px');
            });

        });
    }


    function getAdminGridColumnOrder() {
        $http.get(adminQueueDetailsUrl + '/' + workflowID + '/' + queueID).success(function (response) {
            //getting the work status counts
            $scope.workStatusTotalCount = response.TotalCount;
            $scope.workStatusActiveCount = response.Active;
            $scope.workStatusSuspendedCount = response.Suspended;
            $scope.workStatusassignedCount = response.Assigned;
            $scope.workStatusunassignedCount = response.Unassigned;
            //console.log(response);
        }).error(function () {

        });

    }

    $scope.isQueuesSet = function (id) {
        return $scope.instanceSelected === id;
    }

    $scope.selectedRows = [];
    $scope.setInstances = function (item) {
        //item.StorageRepositoryId,item.InstanceId, item.DocumentId, item.StatusAsString, item.OwningUserFullName
        if (item.selected) {
            item.selected = false;
            $scope.selectedRows.splice($scope.selectedRows.indexOf(item), 1);
            if($scope.selectedRows.length==1){
                adminServices.setStorageRepoId($scope.selectedRows[0].StorageRepositoryId);
            }
                        
        } else {
            item.selected = true;
            $scope.selectedRows.push(item);
            adminServices.setStorageRepoId(item.StorageRepositoryId);
        }
        setMenuStatus($scope.selectedRows.length);
    }


    function setMenuStatus(len) {
        $scope.isOneRowSelected = (len > 0);
        $scope.isSingleSelect = (len == 1);
        $scope.isActivateEnabled = (len > 0) ? $rootScope.userDetails.CanActivate : false;
        $scope.isSuspendEnabled = (len > 0) ? $rootScope.userDetails.CanSuspend : false;
        $scope.isAlterEnabled = (len > 0) ? $rootScope.userDetails.CanAlter : false;
        $scope.isDeleteEnabled = (len > 0) ? $rootScope.userDetails.CanDelete : false;
    }
    $scope.showViewHistoryAdmin = function () {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/viewHistory.html',
            controller: 'ModalInstanceViewHistoryController',
            resolve: {
                items: function () {
                    return $scope.selectedRows[0].InstanceId;
                },
                docId: function () {
                    return $scope.selectedRows[0].DocumentId;
                }
            }
        });

    };

    $scope.showViewNotesAdmin = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/WorkflowNotes.html',
            controller: 'ModalInstanceViewNotesController',
            resolve: {
                items: function () {
                    return $scope.selectedRows[0].InstanceId;
                },
                docId: function () {
                    return $scope.selectedRows[0].DocumentId;
                }
            }
        });
        
        

        modalInstance.result.then(function (response) {
            if (response.isSuccess && response.isSubmitted) {
                refreshAdminWorkFlows();
            }
        }, function () {

        });


    };


    $scope.showDocumentNotesAdmin = function () {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/DocumentNotes.html',
            controller: 'ModalInstanceDocumentNotesController',
            resolve: {
                items: function () {
                    return $scope.selectedRows[0].InstanceId;
                },
                docId: function () {
                    return $scope.selectedRows[0].DocumentId;
                }
            }
        });

        modalInstance.result.then(function (isSuccess) {
            if (isSuccess) {
                refreshAdminWorkFlows();
            }
        }, function () {

        });


    };


    $scope.exportToExcelAdmin = function () {
        var tab_text = "<table style='width:100%;' border='1' ><tr bgcolor='#000'>";
        var textRange;
        var j = 0;
        tab = document.getElementById('gridTable'); // id of table

        for (j = 0; j < tab.rows.length; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        }

        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        // if Internet Explorer
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa = txtArea1.document.execCommand("SaveAs", true, "Download.xls");
        } else // other browser not tested on IE 11
            sa = $window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
        return (sa);
    }


    //set the dropdowns for clicked tabs
    $scope.setDropDown = function (name, $event) {
        if ($scope.activeDropDown != name) {
            $scope.activeDropDown = name;
        } else {
            $scope.activeDropDown = -1;
        }
        $('.' + name).css('left', angular.element($event.target).prop('offsetLeft') + 22 + 'px');
        getDropDownDetails(name);
    }

    $scope.isDropDownActive = function (name) {
        return $scope.activeDropDown === name;
    }

    $scope.updateDocumentType = function (type) {
        $http.get(updateDocumentType + '/' + adminServices.getFileNetId() + '/' + type).success(function (response) {
            $scope.activeDropDown = -1;
            refreshAdminWorkFlows();
        }).error(function () {
            $scope.activeDropDown = -1;
        });
    }

    $scope.assignReleaseWorkItem = function (id) {
        var action = (id == "RELEASE") ? "releas" : "assign";
        var workItemIds = [];
        angular.forEach($scope.selectedRows, function (item) {
            workItemIds.push(item.InstanceId);
        });
        var postObj = new Object();
        postObj.SystemId = systemId;
        postObj.UserGpid = $rootScope.userDetails.UserName;
        postObj.WorkItemId = workItemIds;
        postObj.QueueId = queueID;
        postObj.WorkFlowId = workflowID;
        postObj.AssignUserGpid = (id == "RELEASE") ? "*" : id;

        $http({
            url: reAssignWorkItem,
            dataType: 'json',
            method: 'POST',
            data: postObj,
            headers: {
                "Content-type": "application/json"
            }
        }).success(function (response) {
            $scope.activeDropDown = -1;
            commonServices.setNotifyMessage("The workitems has been " + action + "ed.");
            refreshAdminWorkFlows();
        }).error(function () {
            $scope.activeDropDown = -1;
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
                        return "Error while " + action + "ing work items.";
                    }
                }
            });
        });
    }

    $scope.alterWorkItem = function (id, name) {
        var action = "alter";
        var workItemIds = [];
        angular.forEach($scope.selectedRows, function (item) {
            workItemIds.push(item.InstanceId);
        });
        var postObj = new Object();
        postObj.SystemId = parseInt(systemId);
        postObj.UserGpid = $rootScope.userDetails.UserName;
        postObj.DocumentTypeId = id;
        postObj.DocTypeName = name;
        postObj.WorkItemId = workItemIds;


        $http({
            url: alterWorkItem,
            dataType: 'json',
            method: 'POST',
            data: postObj,
            headers: {
                "Content-type": "application/json"
            }
        }).success(function (response) {
            if (response == true) {
                $scope.activeDropDown = -1;
                commonServices.setNotifyMessage("The workitems has been " + action + "ed.");
                refreshAdminWorkFlows();
                var url = urlConstants.adminTreeGetWorkflows + $rootScope.userDetails.UserName + '/' + systemId
                $http.get(url).success(function (response) {
                    $scope.adminQueueDetails = response[selectedAdminWorkFlowQueue].UserWorkflowQueues;
                }).error(function (error) {

                });
            } else {
                $scope.activeDropDown = -1;
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
                            return "Can't " + action + " the Document Type.";
                        }
                    }
                });
                workItemIds = [];
            }

        }).error(function () {
            $scope.activeDropDown = -1;
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
                        return "Error while " + action + "ing Document Type.";
                    }
                }
            });
            workItemIds = [];

        });
    };


    $scope.activateSuspendWorkItem = function (tabVal) {
        var workItemIds = [];
        var status = [];
        $scope.showWorkItemStatusMessage = false;
        angular.forEach($scope.selectedRows, function (item) {
            workItemIds.push(item.InstanceId);
            status.push(item.StatusAsString.toLowerCase());

            if (item.StatusAsString.toLowerCase() != tabVal.toLowerCase()) {
                var action = (tabVal.toLowerCase() == "active") ? "activat" : tabVal.toLowerCase();
                var postObj = new Object();
                postObj.SystemID = systemId;
                postObj.UserGPID = $rootScope.userDetails.UserName;
                postObj.WorkItemID = workItemIds;
                postObj.WIStatusName = tabVal.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
                    return g1.toUpperCase() + g2.toLowerCase();
                });
                postObj.QueueId = queueID;
                postObj.WorkflowID = workflowID;

                $http({
                    url: activateWorkItem,
                    dataType: 'json',
                    method: 'POST',
                    data: postObj,
                    headers: {
                        "Content-type": "application/json"
                    }
                }).success(function (response) {
                    $scope.activeDropDown = -1;
                    commonServices.setNotifyMessage("The workitems has been " + action + "ed.");
                    refreshAdminWorkFlows();
                }).error(function (response) {
                    $scope.activeDropDown = -1;
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
                                return "Error while " + action + "ing work items.";
                            }
                        }
                    });
                });
            } else {
                if ($scope.selectedRows.length == 1) {
                    $scope.showWorkItemStatusMessage = true;
                    $scope.workItemStatusMessage = 'The selected work Item is already in ' + tabVal + ' state';
                }

            }

        });

    }



    $scope.searchFilter = function (obj) {

        //search for dynamic columns
        var dynamicValues = [];
        angular.forEach(obj.DynamicProperties, function (value, key) {
            dynamicValues.push(value);
        });

        RegExp.escape = function (s) {
            if (s != undefined)
                return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };

        var re = new RegExp(RegExp.escape($scope.listItems), 'i');

        return !$scope.listItems || re.test(obj.InstanceId) || re.test(obj.DocumentType) || re.test(obj.QueueEntryDateAsString) || re.test(obj.Title) || re.test(obj.StatusAsString) || re.test(obj.OwningUserFullName) || re.test(obj.OwningUserGpid) || re.test(obj.Aging) || re.test(obj.LatestNote) || re.test(dynamicValues);

    };

    $scope.deleteWorkItem = function () {
        var workItemIds = [];
        angular.forEach($scope.selectedRows, function (item) {
            workItemIds.push(item.InstanceId);
        })
        var postObj = new Object();
        postObj.SystemID = systemId;
        postObj.UserGPID = $rootScope.userDetails.UserName;
        postObj.WorkItemID = workItemIds;
        postObj.QueueId = queueID;
        postObj.WorkflowID = workflowID;

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteWorkItem.html',
            controller: 'ModalInstanceDeleteController',
            resolve: {
                items: function () {
                    return postObj;
                }
            }
        });

        modalInstance.result.then(function (isSuccess) {
            if (isSuccess) {
                var currVal = parseInt($('.admin-tree ul.parent .child li a.active span').text().replace(/[^0-9]/g, "")) - $scope.selectedRows.length;
                $('.admin-tree ul.parent .child li a.active span').text("(" + currVal + ")")
                refreshAdminWorkFlows();
            }
        }, function () {

        });

    }

    $scope.refreshWorkItem = function () {
        //checking whether the refresh button is clicked before the admin queue calls
        if (adminServices.getCurrentAdminQueueWorkItemDetails() != null) {
            refreshAdminWorkFlows(true);
        } else {
            $window.location.reload();
        }


    }

    function refreshAdminWorkFlows(pageRefresh) {
        $scope.clearAlertMessages();
        if (pageRefresh) {
            $scope.isAdminTreeLoading = true;
            $http.get(adminWorkFlow).success(function (response) {
                $scope.isAdminTreeLoading = false;
                $scope.adminTreeWorkFlowDetails = response;
                setTimeout(function () {
                    $('.content-left').height($(window).height() - 260);
                    $('.admin-tree ul.parent .child').height($(window).height() - 430);
                }, 0);
            }).error(function () {
                $scope.isAdminTreeLoading = false;
            });
        }
        $timeout(function () {
            $scope.adminQueueWorkItemsDetails = null;
            angular.element('.admin-tree ul.child a.active').triggerHandler('click');
            isAdminChange = true;
        }, 1000);

        adminServices.setAdminTabsDisabled(true);
        $scope.instanceRow = -1;
    }

    $scope.isAssignGpIdEmpty = function (val) {
        if (val == '') {
            $scope.isAssignSubmitDisabled = true;
        } else {
            $scope.isAssignSubmitDisabled = false;
        }
    }

    $scope.isICountNull = function (count) {
        if (count == 0)
            return true;
    }

    $scope.clearAlertMessages = function () {
        $scope.showWorkItemStatusMessage = false;
        $scope.isApiCallsSuccess = false;
        $scope.error = false;
    }

    //get DropDown Menu Details
    function getDropDownDetails(tabName) {
        $scope.isDropDownLoading = true;

        if (tabName == $scope.adminEmitter.reAssign) {
            $scope.gpIds = [];
            var reAssignUsers = reAssignItemGpIds + '/' + $rootScope.userDetails.UserName + '/' + systemId
            $http.get(reAssignUsers).success(function (response) {
                angular.forEach(response, function (item) {
                    if ($scope.gpid)
                        $scope.gpIds.push({
                            'value': item.UserName,
                            'name': item.UserName
                        });
                    else
                        $scope.gpIds.push({
                            'value': item.UserName,
                            'name': item.FullName
                        });
                });
                $scope.selectedId = ($scope.gpid) ? $scope.gpIds[0].UserName : $scope.gpIds[0].FullName;
                $scope.isDropDownLoading = false;
            }).error(function () {
                $scope.isDropDownLoading = false;
            });

        }

        if (tabName == $scope.adminEmitter.alter) {
            $scope.gpIdsAlter = [];
            var alterUsers = alterItemGpIds + '/' + $rootScope.userDetails.UserName + '/' + systemId
            $http.get(alterUsers).success(function (response) {
                angular.forEach(response, function (item) {
                    $scope.gpIdsAlter.push({
                        'value': item.Id,
                        'name': item.Name
                    });
                });
                $scope.isDropDownLoading = false;
            }).error(function () {
                $scope.isDropDownLoading = false;
            });
        }
    }

    $('.table').dragableColumns();

    $('.table th').on('drop', function (event) {
        var title = [];;
        var newIndex;

        $.each($('.table th'), function (index) {
            title.push($(this).find('.title').text());
            var titleStrings = title.join('-');
            if (index == ($('.table th').length - 1)) {
                $http.get(saveUserPreferences + '1/' + adminQueueID + '/' + processActivityID + '/' + titleStrings)
                    .success(function (response) {

                    }).error(function () {

                    });
            }
        });

    });

    function setadminContentLeftHeight() {
        $('.content-right, .table-responsive').height($(window).height() - 244);

        setTimeout(function () {
            $('.content-left, .content-left-bar').height($(window).height() - 244);
            $('.admin-tree ul.parent .child').height($(window).height() - 244 - 205);
        }, 50);

    }

    $(window).resize(function () {
        setadminContentLeftHeight();
    });

    setadminContentLeftHeight();

    $scope.hideContentLeftPanel = function () {
        $('.content-left').toggleClass('swap-content-left');
        $('.content-right').toggleClass('adjust-content-right');
    }


    /* navigation slider */
    $('.main-labels-static .prev').hide();

    //getting width of the static menus
    function getStaticMenuWidth() {
        var totalWidth = 0;
        $('.img-vision-admin .main-labels-static ul li').each(function () {
            totalWidth = totalWidth + ($(this).width() + 15);
        });
        $('.img-vision-admin .main-labels-static ul').width(totalWidth);

    }

    $('.img-vision-admin .main-labels-static').on('click', '.nxt', function () {

        $('.img-vision-admin .main-labels-static ul').animate({
            left: -($('.img-vision-admin .main-labels-static ul').width() - $(window).width())
        }, 300, function () {
            $('.img-vision-admin .main-labels-static .prev').show();
            $('.img-vision-admin .main-labels-static .nxt').hide();
        });
    });

    $('.img-vision-admin .main-labels-static').on('click', '.prev', function () {

        $('.img-vision-admin .main-labels-static ul').animate({
            left: 25
        }, 300, function () {
            $('.img-vision-admin .main-labels-static .prev').hide();
            $('.img-vision-admin .main-labels-static .nxt').show();
        });
    });


    /* navigation slider */

});