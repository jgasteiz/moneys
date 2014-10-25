// logger.js
(function() {
    'use strict';

    angular
        .module('moneys')
        .factory('logger', logger);

    logger.$inject = ['$log'];

    function logger($log) {
        return $log;
    }
})();