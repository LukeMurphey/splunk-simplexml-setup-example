require.config({
    paths: {
        setup_view: '../app/simplexml_setup/js/views/SetupView'
    }
});

define([
    "underscore",
    "jquery",
    "setup_view",
], function(
    _,
    $,
    SetupView
){

    return SetupView.extend({
        className: "CustomSetupView",

        events: {
            "click #save-config" : "saveConfig"
        },

        initialize: function() {
        	this.options = _.extend({}, this.defaults, this.options);
            SetupView.prototype.initialize.apply(this, [this.options]);
        },

        saveConfig: function(){
            if(this.userHasAdminAllObjects()){
                this.setConfigured();
            }
            else{
                alert("You don't have permission to edit this app");
            }
        },
        
        render: function () {
            if(this.userHasAdminAllObjects()){
                this.$el.html('This is my custom setup page <br /><br /><a href="#" class="btn btn-primary" id="save-config">Save Configuration</a>');
            }
            else{
                this.$el.html("Sorry, you don't have permission to perform setup");
            }
        }
    });
});