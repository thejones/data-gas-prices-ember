/**
 * COPYRIGHT 2013 ESRI
 *
 * TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 * Unpublished material - all rights reserved under the
 * Copyright Laws of the United States and applicable international
 * laws, treaties, and conventions.

 * For additional information, contact:
 * Environmental Systems Research Institute, Inc.
 * Attn: Contracts and Legal Services Department
 * 380 New York Street
 * Redlands, California, 92373
 * USA

 * email: contracts@esri.com
 */

// Dojo AMD stuff
var dojoConfig = {
  packages: [
    {
      name: 'app',
      location: location.pathname.replace(/\/[^/]+$/, '') + '/js'
    }
  ]
};

// This is our main AMD module.
// We will create the Ember application and define its objects.
require(dojoConfig, [
  "esri/geometry/Extent",
  "app/IndexRoute",
  "app/IndexController",
  "app/LegendContainerView",
  "app/MapContainerView"
], function (Extent, IndexRoute, IndexController, LegendContainerView, MapContainerView) {

  // Start the Ember App
  window.App = Ember.Application.create({});

  // Define a constant for this application that is the extent for the map
 App.boundingExtent = new Extent({
    "xmin": -6293496,
    "ymin": -1530060,
    "xmax": 2256320,
    "ymax": 4592025,
    "spatialReference": {
      "wkid": 102003
    }
  });

  // Define the various Ember objects. A series of objects will be defined by default by Ember.
  // For example the IndexView will be auto generated using the template defined in index.html.

  // Define an application view so we can set the class names
  App.ApplicationView = Ember.View.extend({
    classNames: ["full-container"]
  });

  // This application is directly on the index route. Define the route so we can handle events
  App.IndexRoute = IndexRoute;

  // The index controller will store the sate of the application
  App.IndexController = IndexController;

  // Our app is composed of a map view and a legend view that will work based on the index controller
  App.LegendContainerView = LegendContainerView;
  App.MapContainerView = MapContainerView;

});