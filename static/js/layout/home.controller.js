(function() {
    'use strict';

    angular
        .module('moneys')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['dataservice', 'logger']

    function HomeController(dataservice, logger) {

        var vm = this;

        vm.date = moment();
        vm.transactions = {};
        vm.categories = [];
        vm.showIgnoredTransactions = false;
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

        /**
         * Dict of the selected category transactions
         * @type {Object}
         */
        vm.selectedCategories = {};

        /**
         * Object for keeping the ids of the selected categories which will
         * be used to be assigned to the selected transactions.
         * @type {Object}
         */
        vm.assignSelectedCategories = {};

        /**
         * Dict of the shown categories in the transacion list.
         * @type {Object}
         */
        vm.shownCategories = {};

        /**
         * Dict for keeping the category names.
         * @type {Object}
         */
        vm.categoryNames = {};

        vm.selectedExpenses = parseFloat(0).toFixed(2);
        vm.selectedIncomes = parseFloat(0).toFixed(2);

    	vm.previousMonth = function() {
    		vm.date = vm.date.subtract(1, 'months');
            vm.selectNone();
            vm.showAllTypes();
            getTransactions();
    	};
        vm.nextMonth = function() {
            vm.date = vm.date.add(1, 'months');
            vm.selectNone();
            vm.showAllTypes();
            getTransactions();
        };

        vm.hasNextMonth = function() {
            var now = moment();
            return vm.date.month() >= now.month() && vm.date.year() >= now.year();
        };

        vm.sortByQuantity = function() {
            vm.transactions.transactions = _.sortBy(vm.transactions.transactions, function(transaction) {
                return parseFloat(transaction.debit_amount) || parseFloat(transaction.credit_amount);
            }).reverse();
        };

        vm.sortByDate = function() {
            vm.transactions.transactions = _.sortBy(vm.transactions.transactions, function(transaction) {
                return moment(transaction.transaction_date);
            }).reverse();
        };

        vm.toggleTypeSelection = function(type) {
            vm.selectedTypes[type] = !vm.selectedTypes[type];
            var selectedExpenses = vm.transactions.transactions.filter(function(transaction) {
                return transaction.transaction_type === type;
            }).map(function(transaction) {
                transaction.selected = vm.selectedTypes[type];
                vm.updateSelectedTransaction(transaction);
            });
        };

        vm.toggleCategorySelection = function(category) {
            vm.selectedCategories[category] = !vm.selectedCategories[category];
            var selectedExpenses = vm.transactions.transactions.filter(function(transaction) {
                return transaction.category.indexOf(category) > -1;
            }).map(function(transaction) {
                transaction.selected = vm.selectedCategories[category];
                vm.updateSelectedTransaction(transaction);
            });
        };

        vm.toggleTypeShown = function(type) {
            vm.shownTypes[type] = !vm.shownTypes[type];
        };

        vm.toggleCategoryShown = function(categoryId) {
            vm.shownCategories[categoryId] = !vm.shownCategories[categoryId];
        }

        vm.isCategoryHidden = function(categories) {
            var isHidden = false;
            angular.forEach(categories, function(categoryId) {
                if (vm.shownCategories[categoryId] === false) {
                    isHidden = true;
                }
            });
            return isHidden;
        }

        vm.selectNone = function() {
            vm.restoreSelectedTransactions();
            for (var i in vm.selectedTypes) {
                vm.selectedTypes[i] = false;
            }
            for (var i in vm.selectedCategories) {
                vm.selectedCategories[i] = false;
            }
            angular.forEach(vm.transactions.transactions, function(transaction) {
                transaction.selected = false;
            });
        };

        vm.selectAll = function() {
            vm.restoreSelectedTransactions();
            for (var i in vm.selectedTypes) {
                vm.selectedTypes[i] = true;
            }
            for (var i in vm.selectedCategories) {
                vm.selectedCategories[i] = true;
            }
            angular.forEach(vm.transactions.transactions, function(transaction) {
                transaction.selected = true;
                vm.updateSelectedTransaction(transaction);
            });
        };

        vm.showAllTypes = function() {
            for (var i in vm.shownTypes) {
                vm.shownTypes[i] = true;
            }
        };

        vm.showNoTypes = function() {
            for (var i in vm.shownTypes) {
                vm.shownTypes[i] = false;
            }
        };

        vm.ignoreTransactions = function() {
            var ids = getSelectedIds();
            dataservice.ignoreTransactions(ids)
                .then(function(data) {
                    getTransactions();
                });
        };

        vm.undoIgnoreTransactions = function() {
            var ids = getSelectedIds();
            dataservice.undoIgnoreTransactions(ids)
                .then(function(data) {
                    getTransactions();
                });
        };

        vm.keydownSelectTransaction = function(event, transaction) {
            if (event.keyCode === 32) {
                event.preventDefault();
                vm.updateSelectedTransaction(transaction);
            }
        };

        vm.updateSelectedTransaction = function(transaction) {
            transaction.selected = !transaction.selected;
            if (transaction.ignored) {
                return;
            }
            if (transaction.debit_amount) {
                var selectedExpenses = parseFloat(vm.selectedExpenses);
                if (transaction.selected) {
                    selectedExpenses = selectedExpenses + parseFloat(transaction.debit_amount);
                } else {
                    selectedExpenses = selectedExpenses - parseFloat(transaction.debit_amount);
                }
                vm.selectedExpenses = selectedExpenses.toFixed(2);
            } else {
                var selectedIncomes = parseFloat(vm.selectedIncomes);
                if (transaction.selected) {
                    selectedIncomes = selectedIncomes + parseFloat(transaction.credit_amount);
                } else {
                    selectedIncomes = selectedIncomes - parseFloat(transaction.credit_amount);
                }
                vm.selectedIncomes = selectedIncomes.toFixed(2);
            }
        };

        vm.restoreSelectedTransactions = function() {
            vm.selectedExpenses = parseFloat(0).toFixed(2);
            vm.selectedIncomes = parseFloat(0).toFixed(2);
        };

        vm.applyCategories = function() {
            var selectedIds = getSelectedIds(),
                selectedCategories = Object.keys(vm.assignSelectedCategories)
                .filter(function(key) {
                    return vm.assignSelectedCategories[key] === true;
                });
            dataservice.applyCategories(selectedIds, selectedCategories)
                .then(function(data) {
                    getTransactions();
                });
        };

        activate();

        function getSelectedIds() {
            return vm.transactions.transactions.filter(function(transaction) {
                return transaction.selected;
            }).reduce(function(acc, transaction) {
                transaction.selected = false;
                acc.push(transaction.id);
                return acc;
            }, []);
        }

        function activate() {
            getTransactions().then(function() {
                logger.info('Transactions fetched');
            });
            return getCategories().then(function() {
                logger.info('Categories fetched');
            });
        }

        function getTransactions() {
            return dataservice.getTransactions({date: vm.date.format('YYYY-MM')})
                .then(function(data) {
                    vm.transactions = data;
                    return vm.transactions;
                });
        }

        function getCategories() {
            return dataservice.getCategories()
                .then(function(data) {
                    vm.categories = data;
                    vm.selectedCategories = {};
                    vm.shownCategories = {};
                    angular.forEach(vm.categories, function(category) {
                        vm.selectedCategories[category.id] = false;
                        vm.shownCategories[category.id] = true;
                        vm.categoryNames[category.id] = category.name;
                    });
                    return vm.categories;
                });
        }
    }
})();