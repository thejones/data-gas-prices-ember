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
  
  return Ember.ContainerView.extend({
    classNames: ["legend", "shadow", "info"],
    childViews: ["legendView", "tipView"],

    legendView: Ember.View.extend({

      mapChanged: function () {
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
      }.observes("controller.featureLayer").on("init")
    }),

    tipView: Ember.View.extend({
      classNames: ["tip"],
      templateName: "tip",

      mapChanged: function () {
        var featureLayer = this.get("controller.featureLayer");
        if (Ember.isEmpty(featureLayer))
          return;

        // Wire the feature layer mouse event to the tip
        featureLayer.on("mouse-over", this.onMouseOverFeatureLayer.bind(this));
        featureLayer.on("mouse-out", this.onMouseOutFetaureLayer.bind(this));

      }.observes("controller.featureLayer").on("init"),

      onMouseOverFeatureLayer: function (e) {
        this.set("attributes", e.graphic.attributes);
      },

      onMouseOutFetaureLayer: function () {
        this.set("attributes", null);
      }
    })
  });
});