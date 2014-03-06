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
define(function () {

  // This is our index route controller. Its main mission is to carry the state of route.
  // It will receive the feature layer the model
  return Ember.ObjectController.extend({

    // When both the map and the fetaure layer are ready we need to associate them together
    onFeatureLayerOrMapChanged: function () {
      var featureLayer = this.get("featureLayer");
      var map = this.get("map");
      if (Ember.isEmpty(featureLayer) || Ember.isEmpty(map))
        return;

      // Add the feature layer to the map
      map.addLayer(featureLayer);

      // We can inform the route that we are ready to go
      this.send("isReady");
    }.observes("featureLayer", "map")
  });
});