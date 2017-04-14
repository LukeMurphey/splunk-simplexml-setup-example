# Creating a SimpleXML Setup View in Splunk
This is an example of how to create a setup page in Splunk using SimpleXML and Javascript as an alernative to Splunk setup.xml.

## Why would I want this?

There are several reasons why you might want to make a setup view in SimpleXML versus setup.xml:

1) You want to customize the view (custom widgets, appearance, etc.)
2) You want to use some custom Javascript but Splunk won't certify your app because they don't certify apps with Javascript in setup.xml
3) You want the more modern appearance that comes with using SimpleXML


## What else do I need to know?

This is only going to work in Splunk 6.2+. This because Splunk didn't support the setup.xml redirect functionality that we are going to use until version 6.2. Furthermore, you will need to use Splunk 6.2.1 or higher if your app is not visible (that is, not listed on the list of apps on the Splunk frontpage). This is because Splunk 6.2 didn't originally allow the setup.xml redirect to work with invisible apps (would generate an error).

## How do I make a SimpleXML setup view?

This tutorial is going to assume you already have a basic app in existence.

### Step 1: create the redirect setup block
First, you will need a setup.xml page under the apps "default" directory. The file will be placed in: default/setup.xml.

The file will only need to tell Splunk to redirect to the simpleXML setup page. It should look like this:

```
  <setup>
    <block task="setup" type="redirect" />
  </setup>
```

### Step 2: create the SimpleXML setup view
Now, you will need to create the simpleXML setup view that Splunk will forward your users to. This also needs to be named "setup.xml" but this will need to be created in "default/data/ui/views/setup.xml".

You can start by copying in the following (though you may want to change the description to use the name of your app):

```
<form hideEdit="true" script="setup.js">
  <label>Configuration</label>
  <description>Global configuration for my custom app</description>
	<row>
	   <panel>
	      <html>
	         <div id="setupView"></div>
	      </html>
	   </panel>
	</row>
</form>
```

Restart your Splunk install. Once your Splunk install starts back up, go the list of apps in the Splunk manager (e.g. "http://127.0.0.1:8000/en-US/manager/search/apps/local") and click the link titled "Set up" next to your app. This should cause the setup view you just made to show up. The setup view doesn't do anything just yet; we will handle that in the next few steps.

### Step 3: get the SetupView base class
Next, copy in the SetupView.js file from https://gist.github.com/LukeMurphey/a4426a951479a19371aad3dd826ab002 into your app at the following directory of your app: "/appserver/static/js/views/SetupView.js".

This file includes a base class that simplifies the process of making a SimpleXML setup view.

### Step 4: create your custom setup Javascript view
Next, create a custom setup view. In my case, I am going to name my view "CustomSetupView.js". I will put this file at "appserver/static/js/views/CustomSetupView.js" within my app.

To start, I will add the following at the top of the file to import the SetupView base class that I added in the previous step. Make sure to change the name of the app accordingly (i.e. replace "simplexml_setup" with the name of your app).

```
require.config({
    paths: {
        setup_view: '../app/simplexml_setup/js/views/SetupView'
    }
});
```

Next, I declare the rest of the class under the require config line I just made (change "CustomSetupView" to match the name of your file if you named it something different).

```
define([
    "underscore",
    "backbone",
    "jquery",
    "setup_view",
], function(
    _,
    Backbone,
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
            this.$el.html('<a href="#" class="btn btn-primary" id="save-config">Save Configuration</a>');
        }
    });
});
```

### Step 5: load the custom SimpleXML view in the view

Next, we need to wire up the view above to the SimpleXML setup view. To do this, create a file named "setup.js" in "appserver/static/setup.js".

The file should look something like the file below. Make sure to change the name of the app to match the name of your app (replace "simplexml_setup" with your app name). Also, replace "CustomSetupView" to match the name of the file you made in the previous step if you didn't name it "CustomSetupView").

```
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
```

Restart your Splunk install and open the setup page. It should look something like this:

![Setup page image](https://github.com/LukeMurphey/splunk-simplexml-setup-example/blob/master/custom_setup.png)

### Step 6: add your custom setup code

So far, the setup page really doesn't do too much. Now you need to add your own code that does what custom setup you want. This is largely out of scope for this tutorial. See http://dev.splunk.com/view/webframework-splunkjsstack/SP-CAAAEMT for some help for writing SplunkJS.

Here are a couple of pointers as you create your custom setup view:

 1) Make sure that this.setConfigured() is called when your app completes setup. setConfigured() will tell Splunk to consider the app configured so that it no longer redirects users to the setup page.
 2) Check to make sure that the user has permission to perform setup. You can determine if the user has the "admin_all_objects" capability by calling using the function userHasAdminAllObjects() which will return true of the user has "admin_all_objects". You can also use hasCapability() to determine if the user has a particular capability. You can call this function like this: this.hasCapability('admin_all_objects').
  3) You may want to hide the setup page if the user doesn't have permission to setup the app. In this case, you could have your do the permission check and then show a warning instead of the setup page if the user lacks permission.

For this example, I'm going to add some text describing the setup page. I can do this by modifying the HTML in the render() function of CustomSetupView.js:

```
        render: function () {
            this.$el.html('This is my custom setup page <br /><br /><a href="#" class="btn btn-primary" id="save-config">Save Configuration</a>');
        }
```

Next, I'll show a warning message if the user doesn't have permission to perform setup:

```
        render: function () {
            if(this.userHasAdminAllObjects()){
                this.$el.html('This is my custom setup page <br /><br /><a href="#" class="btn btn-primary" id="save-config">Save Configuration</a>');
            }
            else{
                this.$el.html("Sorry, you don't have permission to perform setup");
            }
        }
```

### *[optional]* Step 7: mark your app as requring configuration

If your app requires setup, then you will want to mark your app requiring configuration in app.conf.

To do this, edit your app.conf and set "is_configured" to "false" under the "install" stanza (in "default/apps.conf" within your app):

```
[install]
is_configured = false
```

### *[optional]* Step 8: add a link to the setup page in your navigation

You may want to include a link to your setup page from your app's navigation. To do so, just modify the default nav at "default/data/ui/nav/default.xml" to include a link to the view "setup". In my case, the navigation looks like this:

```
<nav color="#f37802">
  <a href='setup'>Configuration</a>
</nav>
```
