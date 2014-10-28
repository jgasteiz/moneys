(function() {
    'use strict';

    angular
        .module('moneys')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['dataservice', 'logger', '$http']

    function HomeController(dataservice, logger, $http) {

        var vm = this;

        vm.date = moment();
        vm.expenses = {};
        vm.showIgnoredExpenses = false;
        vm.selectedTypes = {
            'TFR': false,
            'DEB': false,
            'FPI': false,
            'FPO': false,
            'CPT': false,
            'DD': false
        };
        vm.shownTypes = {
            'TFR': true,
            'DEB': true,
            'FPI': true,
            'FPO': true,
            'CPT': true,
            'DD': true
        };

        vm.http = $http;

    	vm.previousMonth = function() {
    		vm.date = vm.date.subtract(1, 'months');
            vm.selectNone();
            vm.showAllTypes();
            getExpenses();
    	};
        vm.nextMonth = function() {
            vm.date = vm.date.add(1, 'months');
            vm.selectNone();
            vm.showAllTypes();
            getExpenses();
        };

        vm.hasNextMonth = function() {
            var now = moment();
            return vm.date.month() >= now.month() && vm.date.year() >= now.year();
        };

        vm.sortByQuantity = function() {
            vm.expenses.expenses = _.sortBy(vm.expenses.expenses, function(expense) {
                return parseFloat(expense.debit_amount) || parseFloat(expense.credit_amount);
            }).reverse();
        };

        vm.sortByDate = function() {
            vm.expenses.expenses = _.sortBy(vm.expenses.expenses, function(expense) {
                return moment(expense.transaction_date);
            }).reverse();
        };

        vm.toggleTypeSelection = function(type) {
            vm.selectedTypes[type] = !vm.selectedTypes[type];
            var selectedExpenses = vm.expenses.expenses.filter(function(expense) {
                return expense.transaction_type === type;
            }).map(function(expense) {
                expense.selected = vm.selectedTypes[type];
            });
        };

        vm.toggleTypeShown = function(type) {
            vm.shownTypes[type] = !vm.shownTypes[type];
        };

        vm.selectNone = function() {
            for (var i in vm.selectedTypes) {
                vm.selectedTypes[i] = false;
            }
            angular.forEach(vm.expenses.expenses, function(expense) {
                expense.selected = false;
            });
        };

        vm.showAllTypes = function(type) {
            for (var i in vm.shownTypes) {
                vm.shownTypes[i] = true;
            }
        };

        vm.ignoreExpenses = function() {
            vm.http({
                method: 'POST',
                url: '/api/expenses/',
                data: {action: 'ignore', ids: getSelectedIds()}
            }).success(function(data) {
                getExpenses();
            }).error(function(data) {
                logger.error(data);
            });
        };

        vm.undoIgnoreExpenses = function() {
            vm.http({
                method: 'POST',
                url: '/api/expenses/',
                data: {action: 'unignore', ids: getSelectedIds()}
            }).success(function(data) {
                getExpenses();
            }).error(function(data) {
                logger.error(data);
            });
        };

        activate();

        function getSelectedIds() {
            return vm.expenses.expenses.filter(function(expense) {
                return expense.selected;
            }).reduce(function(acc, expense) {
                expense.selected = false;
                acc.push(expense.id);
                return acc;
            }, []);
        }

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