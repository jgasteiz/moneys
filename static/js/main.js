/*global ff */
(function() {
    'use strict';

    // If there are no results, don't load the map.
    if (!ff.results.listing || ff.results.listing.length === 0) {
        return false;
    }

    var map = new ff.models.Map({
        latitude: ff.results.latitude || null,
        longitude: ff.results.longitude || null,
        elementId: 'map'
    });

    if (ff.results.listing) {
        ff.results.listing.forEach(function(prop) {

            var property = new ff.models.Property(prop);
            property.setMap(map.map);
            map.extendBounds(property.getLatLng());
        });

        map.fitBounds();
    }

})();