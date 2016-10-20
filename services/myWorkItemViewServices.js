ImgVisionApp.factory('myWorkItemViewServices', function ($http, $q, $timeout) {
    
   
    var obj = {};
    
    var isNotesAdded = false;
   
    
    obj.getNotesAdded = function(){
        return isNotesAdded;
    }
    
    obj.setNotesAdded = function(val){
        isNotesAdded = val;
        return isNotesAdded;
    }
    
    return obj;
});
