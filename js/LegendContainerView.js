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
define([
  "esri/dijit/Legend"
], function (Legend) {

  // This view is made of two child views, the feature layer legend view and the tip view
  return Ember.ContainerView.extend({
    classNames: ["legend", "shadow", "info"],
    childViews: ["legendView", "tipView"],

    // A div that display the legend using the SDK legend dijit
    legendView: Ember.View.extend({

      featureLayerOrMapChanged: function () {
        var featureLayer = this.get("controller.featureLayer");
        if (Ember.isEmpty(featureLayer))
          return;

        var map = this.get("controller.map");
        if (Ember.isEmpty(map))
          return;

        this.legend = new Legend({
          map: map,
          layerInfos: [
            { "layer": featureLayer, "title": "Regular Gas" }
          ]
        }, this.elementId);

        this.legend.startup();
      }.observes("controller.featureLayer", "controller.map").on("init")
    }),

    // This is the Tip View. Its mission is to monitor the mouse activity on the feature layer.
    tipView: Ember.View.extend({
      classNames: ["tip"],
      templateName: "tip",

      featureLayerChanged: function () {
        var featureLayer = this.get("controller.featureLayer");
        if (Ember.isEmpty(featureLayer))
          return;

        // Wire the feature layer mouse event to the tip
        featureLayer.on("mouse-over", this.onMouseOverFeatureLayer.bind(this));
        featureLayer.on("mouse-out", this.onMouseOutFetaureLayer.bind(this));

      }.observes("controller.featureLayer").on("init"),

      // If the mouse is over a feature then capture its attributes
      onMouseOverFeatureLayer: function (e) {
        this.set("attributes", e.graphic.attributes);
      },

      // If the mouse is not anymore on a feature then set the current attributes to null
      onMouseOutFetaureLayer: function () {
        this.set("attributes", null);
      }
    })
  });
});