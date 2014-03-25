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
  "dijit/layout/ContentPane",
  "esri/map"
], function (ContentPane, Map) {

  return Ember.View.extend({
    classNames: ["map"],
    templateName: "map",

    didInsertElement: function () {

      // Create the content pane
      var contentPane = new ContentPane({
        region: "center"
      }, this.elementId);

      this.get("parentView").addPane(contentPane);

      // Create the map for the bounding extent
      var map = new Map(this.elementId, {
        extent: App.boundingExtent,
        slider: false
      });

      this.set("controller.map", map);
    }
  });
});