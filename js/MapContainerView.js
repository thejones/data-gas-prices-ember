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
  "dijit/layout/BorderContainer",
  "app/MapView"
], function (BorderContainer, MapView) {

  return Ember.ContainerView.extend({

    classNames: ["map-container"],

    didInsertElement: function () {

      // Create a dojo border container
      this.borderContainer = new BorderContainer(
        {
          design: "headline",
          gutters: false
        }, this.elementId);

      this.borderContainer.startup();

      // Normally a container view will create its child views via the property childViews, however
      // because we are using border container we need to reverse the order. First create the border container
      // then create the child views that will attach their content pane via the addPane method.
      Ember.run.scheduleOnce("afterRender", this, function () {
        this.pushObject(MapView.create({}));
      });
    },

    addPane: function (pane) {
      // Used by child views to attach their pane.
      this.borderContainer.addChild(pane);
    }
  });
});