(function() {
    'use strict';

    angular
        .module('moneys', [
            'ui.bootstrap',
            'ngRoute',
            'ngCookies',
            'ngResource'
        ],
        function($interpolateProvider, $httpProvider, $cookiesProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.headers.common['X-CSRFToken'] = moneys.csrftoken;
        });
})();