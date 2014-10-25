angular
    .module('moneys', [
        'ui.bootstrap',
        'ngRoute',
        'ngResource'
    ],
    function($interpolateProvider, $httpProvider) {
	    $interpolateProvider.startSymbol('[[');
	    $interpolateProvider.endSymbol(']]');
	});
