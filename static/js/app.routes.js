(function() {
    'use strict';

    angular
        .module('moneys')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'static/js/layout/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            })
            .when('/import_csv/', {
                templateUrl: 'static/js/layout/import_csv.html',
                controller: 'ImportCSVController',
                controllerAs: 'vm'
            });
    }
})();