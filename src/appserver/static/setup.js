require.config({
    paths: {
        custom_setup: "../app/simplexml_setup/js/views/CustomSetupView"
    }
});

require([
         "jquery",
         "custom_setup",
         "splunkjs/mvc/simplexml/ready!"
     ], function(
         $,
         CustomSetupView
     )
     {
         
         var customSetupView = new CustomSetupView({
        	 el: $('#setupView')
         });
         
         customSetupView.render();
     }
);
