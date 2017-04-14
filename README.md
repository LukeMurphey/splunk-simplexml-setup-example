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


### Step 1: create the redirect setup block

### Step 2: create the SimpleXML setup view

### Step 3: get the SetupView base class

### Step 4: create your setup Javascript view

### Step 5: add your custom setup code



### *[optional]* Step 6: mark your app as requring configuration

### *[optional]* Step 7: add a link to the setup page in your navigation
