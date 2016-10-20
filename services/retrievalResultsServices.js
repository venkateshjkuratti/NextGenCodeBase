ImgVisionApp.factory('retrievalResultsServices', function ($http, $q, $location, userDetailsServices, urlConstants, $timeout) {

    var obj = {};
    var retrievalSearchResults = '';
    var retrievalSearchHeaders = '';
    var adminTabsDisable = true;
    var exportExcelDisable = true;
    var retrievalTabActive = 0;
    var isloading = false;
    var link = "";
    var docID = "";
    var instanceId = "";
    var isNotesAdded = false;
    var fileNetId ="";
    var selectedRow = null;
    obj.getRetrievalSearchResults = function(){
        return retrievalSearchResults;
    }

    obj.setRetrievalSearchResults = function(val){
        retrievalSearchResults = val;
        return retrievalSearchResults;
    }
    obj.getRetrievalSearchHeaders = function(){
            return retrievalSearchHeaders;
        }

    obj.setRetrievalSearchHeaders = function(val){
        retrievalSearchHeaders = val;
        return retrievalSearchHeaders;
    }

    obj.getRetrievalTabActive = function(){
        return retrievalTabActive;
    }
    obj.setLoader = function(val){
        isloading = val;
        return isloading;
    }
    obj.getLoader = function(val){
        return isloading;
    }
    obj.setRetrievalTabActive = function(val){
        retrievalTabActive = val;
        return retrievalTabActive;
    }
    obj.getWorkItemId = function () {
        return workItemId;
    }

    obj.setWorkItemId = function (val) {
        workItemId = val;
        return workItemId;
    }

    obj.getStatus = function () {
        return status;
    }

    obj.setStatus = function (val) {
        status = val;
        return status;
    }

    obj.getReleaseStatus = function () {
        return releaseStatus;
    }

    obj.setReleaseStatus = function (val) {
        releaseStatus = val;
        return releaseStatus;
    }

    obj.getFileNetId = function () {
        return fileNetId;
    }

    obj.setFileNetId = function (val) {
        if(val){
        var valArr = val.split('idd_');
        fileNetId = valArr[1];
        return fileNetId;
        }
        else
            return;
    }
    
    obj.getAdminTabsDisabled = function () {
        return adminTabsDisable;
    }

    obj.setAdminTabsDisabled = function (val) {
        adminTabsDisable = val;
        return adminTabsDisable;
    }
    obj.getExportTabsDisabled = function () {
        return exportExcelDisable;
    }

    obj.setExportTabsDisabled = function (val) {
        exportExcelDisable = val;
        return exportExcelDisable;
    }
    obj.getLink = function () {
        return link;
    }

    obj.setLink = function (val) {
        link = val;
        return link;
    }
    obj.getDocId = function () {
        return docID;
    }

    obj.setDocId = function (val) {
        docID = val;
        return docID;
    }

    obj.getInstanceId = function () {
        return instanceId;
    }

    obj.setInstanceId = function (val) {
        instanceId = val;
        return instanceId;
    }
    obj.getNotesAdded = function(){
        return isNotesAdded;
    }

    obj.setNotesAdded = function(val){
        isNotesAdded = val;
        return isNotesAdded;
    }
    obj.getSelectedRow = function(){
        return selectedRow;
    }

    obj.setSelectedRow = function(currRow){
        selectedRow = currRow;
        return selectedRow;
    }
    return obj;
});