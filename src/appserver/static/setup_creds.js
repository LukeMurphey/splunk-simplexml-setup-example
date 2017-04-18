require.config({
    paths: {
        credential_setup: "../app/simplexml_setup/js/views/CredentialsSetupView"
    }
});

require([
         "jquery",
         "credential_setup",
         "splunkjs/mvc/simplexml/ready!"
     ], function(
         $,
         CredentialsSetupView
     )
     {
         
         var credentialsSetupView = new CredentialsSetupView({
        	 el: $('#setupView')
         });
         
         credentialsSetupView.render();
     }
);
