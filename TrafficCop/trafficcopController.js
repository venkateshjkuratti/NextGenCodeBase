
ImgVisionApp.controller('trafficcopController', function($scope, trafficcopService,$http,$timeout){
    

 $scope.error = false;

    $scope.isDataAvailable = false;

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.isCount = false;
    $scope.itemListOption = [10,20, 50, 100];
    $scope.itemsPerPageOnSelect = $scope.itemListOption[0];
    
    $scope.sortOrder = ['InstanceID'];
    
    $scope.myWorkItemBasketDetails = [];

    $scope.noInstancesSelected = false;
    $scope.selectedRows = [];

  trafficcopService.getData().then(

        function () {
           // $timeout(function () {
                $scope.isloading = true;
                $scope.myWorkItemBasketDetails = trafficcopService.myData();
                $scope.totalItems = $scope.myWorkItemBasketDetails.length;
                $scope.from = ($scope.currentPage - 1) * $scope.itemsPerPage;
                $scope.toInim = ($scope.currentPage) * $scope.itemsPerPage;
                $scope.to = $scope.toInim > $scope.totalItems ? $scope.totalItems : $scope.toInim;
                $scope.isloading = false;
                if ($scope.totalItems == 0) {
                    $scope.error = true;
                    $scope.isDataAvailable = false;
                } else {
                    $scope.error = false;
                    $scope.isDataAvailable = true;
                    $scope.isCount = true;
                }
           // }, 1000);

        },
        function () {
            $scope.error = true;
            $scope.isloading = false;
            $scope.isDataAvailable = false;
        });
    
    $scope.getworkitems = function (){
        $scope.isloading = true;
        $scope.isDataAvailable = false;
        $scope.isTrafficQueueSelected = true;
        $scope.isrecyclequeueSelected = false;
       

       $timeout(function(){ 
           $scope.myWorkItemBasketDetails = trafficcopService.myData();
                $scope.totalItems = $scope.myWorkItemBasketDetails.length;
                
                if ($scope.totalItems == 0) {
                    $scope.error = true;
                    $scope.isDataAvailable = false;
                } else {
                    $scope.error = false;
                    $scope.isDataAvailable = true;
                    $scope.isCount = true;
                }
        
        $scope.isloading = false;

        },500);
    }


    $scope.setInstances = function (item) {
        //item.StorageRepositoryId,item.InstanceId, item.DocumentId, item.StatusAsString, item.OwningUserFullName
        if (item.selected) {
            item.selected = false;
            $scope.selectedRows.splice($scope.selectedRows.indexOf(item), 1);
        } else {
            item.selected = true;
            $scope.selectedRows.push(item);
        }
        //setMenuStatus($scope.selectedRows.length);
    }
    /* getting Individual Queue details */
   /* $scope.getAdminQueueWorkItemsDetails = function (WorkflowId, id) {

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

            var width;
            setTimeout(function () {
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
        //adminServices.setCurrentAdminQueueWorkItemDetails(adminQueueWorkItemsUrl + '/' + WorkflowId + '/' + id + '/' + true);



    }*/
    
});







