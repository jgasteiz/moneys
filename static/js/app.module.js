(function() {
    'use strict';

    angular
        .module('moneys', [
            'ui.bootstrap',
            'ngRoute',
            'ngCookies',
            'ngResource'
        ],
        function($interpolateProvider, $httpProvider) {
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
        });
})();