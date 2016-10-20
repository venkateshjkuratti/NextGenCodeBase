ImgVisionApp.service('commonServices', function ($http, $q) {
    
    var message = '';
    
    this.getNotifyMessage = function(){
        return message;
    }
    
    this.setNotifyMessage = function(val){
        message = val;
        return message;
    }
    
});
