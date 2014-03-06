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
  "dojo/on",
  "dojo/_base/Color",
  "dojo/number",
  "dijit/layout/ContentPane",
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/geometry/Extent",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/request"
], function (on, Color, number, ContentPane, Map, FeatureLayer, Extent, SimpleRenderer, ClassBreaksRenderer, SimpleLineSymbol, SimpleFillSymbol, esriRequest) {

  return Ember.View.extend({
    classNames: ["map"],
    templateName: "map",

    didInsertElement: function () {

      // Create the content pane
      var contentPane = new ContentPane({
        region: "center"
      }, this.elementId);

      this.get("parentView").addPane(contentPane);

      // Create the map
      var bounds = new Extent({"xmin": -2332499, "ymin": -1530060, "xmax": 2252197, "ymax": 1856904, "spatialReference": {"wkid": 102003}});

      this.map = new Map(this.elementId, {
        extent: bounds,
        lods: [
          {"level": 0, "resolution": 3966, "scale": 15000000}
        ],
        slider: false
      });

      // Create a feature layer using the state service
      this.featureLayer = new FeatureLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3", {
        maxAllowableOffset: this.map.extent.getWidth() / this.map.width,
        mode: FeatureLayer.MODE_SNAPSHOT,
        outFields: ["STATE_NAME"],
        visible: true
      });

      // override default renderer so that states aren't drawn
      // until the gas price data has been loaded and is joined
      this.featureLayer.setRenderer(new SimpleRenderer(null));

      // get gas price data once the feature layer has loaded its data
      // using apify:  http://apify.heroku.com/resources
      // edit the apify thing:  http://apify.heroku.com/resources/506f19ea8b5ff50002000004/edit
      on.once(this.featureLayer, "update-end", function () {
        esriRequest({
          url: "http://apify.heroku.com/api/gasprices.json",
          callbackParamName: "callback"
        }).then(this.drawFeatureLayer.bind(this), this.onPricesError.bind(this));

      }.bind(this));

      this.map.addLayer(this.featureLayer);

      var controller = this.get("controller");
      controller.set("map", this.map);
    },

    drawFeatureLayer: function (data) {

      // data comes back as text from apify...parse it
      var gasPrices = JSON.parse(data);

      // loop through gas price data, find min/max and populate an object
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

      // format max gas price with two decimal places
      gasMax = this.formatDollars(gasMax);

      // add an attribute to each attribute so gas price is displayed
      // on mouse over below the legend
      this.featureLayer.graphics.forEach(function (graphic) {
        graphic.attributes.GAS_DISPLAY = statePrices[graphic.attributes.STATE_NAME].toFixed(2);
      });

      // create a class breaks renderer
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

      this.featureLayer.setRenderer(classBreakRenderer);
      this.featureLayer.redraw();

      // The Layer is ready set it on the controller for the other views
      var controller = this.get("controller");
      controller.set("featureLayer", this.featureLayer);
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
    },

    onPricesError: function () {
    }
  });
});