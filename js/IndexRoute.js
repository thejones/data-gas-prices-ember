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
  "dojo/promise/all",
  "dojo/_base/Color",
  "dojo/number",
  "esri/request",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/geometry/Extent",
  "esri/layers/FeatureLayer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol"
], function (all, Color, number, esriRequest, Query, QueryTask, Extent, FeatureLayer, ClassBreaksRenderer, SimpleLineSymbol, SimpleFillSymbol) {

  // Define the index route
  return Ember.Route.extend({

    actions: {

      // Define a "isReady" action. When the isReady event is raised by a view or a controller in the route it will be capture by this action handler.
      // When it happens we can safely remove the loading div.
      isReady: function () {
        $(".loading").remove();
      }
    },

    // Will load the model for the route. In this sample the model is the State Feature Layer.
    // This method can return a promise and lod the model asynchronously,
    model: function () {

      // We want to get state features for the bounding extent
      var query = new Query();
      query.outFields = ["OBJECTID", "STATE_NAME"];
      query.where = "1=1";
      query.outSpatialReference = App.boundingExtent.spatialReference;
      query.returnGeometry = true;

      // Get the states asynchronously
      var queryTask = new QueryTask("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3");
      var featureLayerPromise = queryTask.execute(query).then(function (result) {

        // Create a feature layer with the collection of states
        var featureCollectionObject = {
          layerDefinition: {
            geometryType: result.geometryType,
            fields: result.fields,
            extent: App.boundingExtent
          },
          featureSet: result
        };

        return new FeatureLayer(featureCollectionObject);
      });

      // Get asynchronously the gas price data
      // using apify:  http://apify.heroku.com/resources
      // edit the apify thing:  http://apify.heroku.com/resources/506f19ea8b5ff50002000004/edit
      var gasPricePromise = esriRequest({
        url: "http://apify.heroku.com/api/gasprices.json",
        callbackParamName: "callback"
      });

      // Wait for the two promises to be resolved
      return all([featureLayerPromise, gasPricePromise]).then(function (results) {

        // We got both the feature layer and its graphics and the gas price data. We can link the graphics with the gas price data.
        this.linkGasPriceToFeatureLayer(results[0], results[1]);

        // Return the featureLayer as part of our model
        return {
          featureLayer: results[0]
        }
      }.bind(this));
    },

    linkGasPriceToFeatureLayer: function (featureLayer, data) {

      // Data comes back as text from apify...parse it
      var gasPrices = JSON.parse(data);

      // Loop through gas price data, find min/max and populate an object
      // to keep track of the price of regular in each state
      var statePrices = {};
      var gasMin = Infinity;
      var gasMax = -Infinity;
      gasPrices.forEach(function (gasPrice) {
        if (gasPrice.state === "State")
          return;

        var price = parseFloat(parseFloat(gasPrice.regular.replace("$", "")).toFixed(2));
        statePrices[gasPrice.state] = price;
        if (price < gasMin)
          gasMin = price;

        if (price > gasMax)
          gasMax = price;
      });

      // Format max gas price with two decimal places
      gasMax = this.formatDollars(gasMax);

      // Add an attribute to each attribute so gas price is displayed
      // on mouse over below the legend
      featureLayer.graphics.forEach(function (graphic) {
        graphic.attributes.GAS_DISPLAY = statePrices[graphic.attributes.STATE_NAME].toFixed(2);
      });

      // Create a class breaks renderer
      var breaks = this.calcBreaks(gasMin, gasMax, 4);

      var classBreakRenderer = new ClassBreaksRenderer(null, function (graphic) {
        var state = graphic.attributes.STATE_NAME;
        return statePrices[state];
      });

      classBreakRenderer.setMaxInclusive(true);

      var outline = SimpleLineSymbol("solid", new Color("#444"), 1);
      classBreakRenderer.addBreak(breaks[0], breaks[1], new SimpleFillSymbol("solid", outline, new Color([255, 255, 178, 0.75])));
      classBreakRenderer.addBreak(breaks[1], breaks[2], new SimpleFillSymbol("solid", outline, new Color([254, 204, 92, 0.75])));
      classBreakRenderer.addBreak(breaks[2], breaks[3], new SimpleFillSymbol("solid", outline, new Color([253, 141, 60, 0.75])));
      classBreakRenderer.addBreak(breaks[3], gasMax, new SimpleFillSymbol("solid", outline, new Color([227, 26, 28, 0.75])));

      featureLayer.setRenderer(classBreakRenderer);
    },

    calcBreaks: function (min, max, numberOfClasses) {
      var range = (max - min) / numberOfClasses;
      var breakValues = [];
      for (var i = 0; i < numberOfClasses; i++) {
        breakValues[i] = this.formatDollars(min + ( range * i ));
      }
      return breakValues;
    },

    formatDollars: function (num) {
      return number.format(num, { "places": 2 });
    }
  });
});