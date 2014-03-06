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
var dojoConfig = {
  packages: [
    {
      name: 'app',
      location: location.pathname.replace(/\/[^/]+$/, '') + '/js'
    }
  ]
};

require(dojoConfig, [
  "app/IndexRoute",
  "app/IndexController",
  "app/LegendContainerView",
  "app/MapContainerView"
], function (IndexRoute, IndexController, LegendContainerView, MapContainerView) {

  Ember.onerror = function (error) {
    console.error("ERROR: " + error);
  };

  window.App = Ember.Application.create({
    LOG_BINDINGS: true,
    LOG_VIEW_LOOKUPS: true,
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true
  });

//  App.deferReadiness();

  // Define an application view so we can set the class names
  App.ApplicationView = Ember.View.extend({
    classNames: ["full-container"],
    templateName: "application"
  });

  App.IndexRoute = IndexRoute;
  App.IndexController = IndexController;
  App.LegendContainerView = LegendContainerView;
  App.MapContainerView = MapContainerView;

//  App.advanceReadiness();
});