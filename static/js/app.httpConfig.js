(function() {
    'use strict';

    angular
	    .module('moneys')
	    .run(httpConfig);

	function httpConfig($http, $cookies) {
	    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
	}
})();