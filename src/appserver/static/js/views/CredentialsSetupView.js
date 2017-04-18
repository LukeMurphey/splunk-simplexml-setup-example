/**
 * This page contains an example of how to make a SimpleXML setup view that sets credentials.
 * 
 * Here are some things you should know if you want to make your own view that saves credentials.
 * 
 *  1) Template file
 *     The HTML for the form has been placed in /appserver/static/js/templates/CredentialsSetupView.html.
 * 
 *  2) Text require.js plugin
 *     This page uses the text.js plugin for require.JS. It is placed in /appserver/static/js/lib/text.js.
 * 
 *  3) Realm needs to be customized
 *     You will need to set the realm variable in order to make it possible for your app to find the credentials. Set the parameter in 
 * 
 */

require.config({
    paths: {
        text: "../app/simplexml_setup/js/lib/text",
        setup_view: '../app/simplexml_setup/js/views/SetupView'
    }
});

define([
    "underscore",
    "jquery",
    "setup_view",
    "text!../app/simplexml_setup/js/templates/CredentialsSetupView.html"
], function(
    _,
    $,
    SetupView,
    Template
){

    return SetupView.extend({
        className: "CredentialsSetupView",

        events: {
            "click #save-config" : "saveConfig",
        },

        defaults:{
            "realm" : "my_custom_app_realm"
        },

        initialize: function() {
        	this.options = _.extend({}, this.defaults, this.options);
            SetupView.prototype.initialize.apply(this, [this.options]);

            // This is the realm we will use to identify the credentials for this app
            this.realm = this.options.realm;
        },

        saveConfig: function(){
            if(this.userHasAdminAllObjects()){
                this.saveEncryptedCredential($("#username-input", this.$el).val(), $("#password-input", this.$el).val(), this.realm);
            }
            else{
                alert("You don't have permission to edit this app");
            }
        },

        credentialSuccessfullySaved: function(created_new_entry){

            if(created_new_entry){
                alert("A new credential entry was created successfully");
            }
            else{
                alert("The existing credential entry was updated successfully");
            }
            
            this.setConfigured();
        },

        loadCredential: function(){

                $.when(this.getEncryptedCredentialByRealm(this.realm)).done(

                    // Load the existing credential into the form
                    function(credentialModel){

                        if(credentialModel !== null){
                            $(".username-input", this.$el).val(credentialModel.entry.content.get("username"));
                        }
                        
                    }.bind(this)
                );
        },

        render: function () {
            if(this.userHasAdminAllObjects()){
                this.$el.html(Template);

                this.loadCredential();
            }
            else{
                this.$el.html("Sorry, you don't have permission to perform setup");
            }
        }
    });
});