(function() {
    'use strict';

    angular
        .module('moneys')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location', 'dataservice', 'logger']

    function HomeController(location, dataservice, logger) {

        var vm = this;

        vm.date = moment();
        vm.expenses = {};

    	vm.previousMonth = function() {
    		vm.date = vm.date.subtract(1, 'months');
            getExpenses();
    	};
        vm.nextMonth = function() {
            vm.date = vm.date.add(1, 'months');
            getExpenses();
        };

        vm.hasNextMonth = function() {
            var now = moment();
            return vm.date.month() >= now.month() && vm.date.year() >= now.year();
        };

        activate();

        function activate() {
            return getExpenses().then(function() {
                logger.info('Expenses fetched');
            });
        }

        function getExpenses() {
            return dataservice.getExpenses({date: vm.date.format('YYYY-MM')})
                .then(function(data) {
                    vm.expenses = data;
                    return vm.expenses;
                });
        }
    }
})();