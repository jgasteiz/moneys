/*global ff */
(function() {
    'use strict';

    /**
     * Property model.
     */
    ff.models.Property = Backbone.Model.extend({

        /**
         * Initializes the marker and adds a click listener
         */
        initialize: function() {
            this.marker = new google.maps.Marker({
                anchorPoint: new google.maps.Point(16, 45),
                icon: '/static/img/green-home-icon.png',
                position: this.getLatLng(),
                visible: true
            });

            var that = this;
            google.maps.event.addListener(this.marker, 'click', function() {

                if (ff.infowindow) {
                    ff.infowindow.close();
                }
                var template = _.template($('#property-template').html());

                ff.infowindow = new google.maps.InfoWindow({
                    pixelOffset: new google.maps.Size(-16, -85),
                    content: template({property: that.attributes})
                });
                ff.infowindow.open(map, that.marker);
            });
        },

        /**
         * Returns a latlng object with its position.
         * @returns {google.maps.LatLng}
         */
        getLatLng: function() {
            return new google.maps.LatLng(this.get('latitude'), this.get('longitude'));
        },

        /**
         * Sets the marker in the given map.
         * @param map
         */
        setMap: function(map) {
            this.marker.setMap(map);
        }
    });

    /**
     * Map model.
     */
    ff.models.Map = Backbone.Model.extend({

        /**
         * Initializes the map in the given div id as initial parameter
         * and its bounds.
         */
        initialize: function() {
            var mapCenter = new google.maps.LatLng(this.get('latitude'), this.get('longitude')),
                mapOptions = {
                    center: mapCenter,
                    scrollwheel: false,
                    zoom: 10
                },
                mapContainer = document.getElementById(this.get('elementId'));

            this.map = new google.maps.Map(mapContainer, mapOptions);
            this.bounds = new google.maps.LatLngBounds();
        },

        /**
         * Extends the map bounds.
         * @param latLng
         */
        extendBounds: function(latLng) {
            this.bounds.extend(latLng);
        },

        /**
         * Clears map bounds.
         */
        clearBounds: function() {
            this.bounds = new google.maps.LatLngBounds();
        },

        /**
         * Fits the map zoom to its bounds.
         */
        fitBounds: function() {
            this.map.fitBounds(this.bounds);
        }
    });

})();