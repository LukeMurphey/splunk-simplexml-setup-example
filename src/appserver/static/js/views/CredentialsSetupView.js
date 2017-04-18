require.config({
    paths: {
        setup_view: '../app/simplexml_setup/js/views/SetupView'
    }
});

define([
    "underscore",
    "jquery",
    "setup_view",
    "splunkjs/mvc/simpleform/input/text"
], function(
    _,
    $,
    SetupView,
    TextInput
){

    return SetupView.extend({
        className: "CredentialsSetupView",

        events: {
            "click #save-config" : "saveConfig"
        },

        initialize: function() {
        	this.options = _.extend({}, this.defaults, this.options);
            SetupView.prototype.initialize.apply(this, [this.options]);
        },

        saveConfig: function(){
            if(this.userHasAdminAllObjects()){
                this.saveEncryptedCredential("myexample", "myusername", "mypassword", "somerealm");
                this.setConfigured();
            }
            else{
                alert("You don't have permission to edit this app");
            }
        },
        
        /**
         * Get the input template.
         */
        getInputTemplate: function(){
        	
        	return  '<div id="message_dialog"></div>' + 
        			'<span id="event_annotation_form">' + 
        			'<div style="margin-bottom: 32px">Describe this event in order to make it easier to understand the activity (e.g. "garage opening/closing", "TV on", etc.).</div>' +
        			'<div class="input" id="description-input">' +
                		'<label>Description</label>' +
                	'</div>' + 
                	'</span>';
        
        },

        render: function () {
            if(this.userHasAdminAllObjects()){
                this.$el.html('This is my custom setup page <br /><br /> \
                              <div id="username-input"><label>Name</label></div> \
                              <div id="password-input"><label>Password</label></div> \
                              <a href="#" class="btn btn-primary" id="save-config">Save Configuration</a>');

                // Make the input widget
	        	var password_input = new TextInput({
	                "id": "password_input",
	                "searchWhenChanged": false,
	                "el": $('#password-input', this.$el)
	            }, {tokens: true}).render();

                // Get the default encrypted credential
                this.getEncryptedCredential("_new");
            }
            else{
                this.$el.html("Sorry, you don't have permission to perform setup");
            }
        }
    });
});