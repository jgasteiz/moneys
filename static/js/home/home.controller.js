(function() {
    'use strict';

    angular
        .module('moneys')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'dataservice', 'logger'];

    function HomeController($scope, dataservice, logger) {

        var vm = this;

        vm.date = moment();
        vm.transactions = {};
        vm.categories = [];
        vm.showIgnoredTransactions = false;

        vm.hideInfoPanel = true;

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
            getTransactions();
        };
        vm.nextMonth = function() {
            vm.date = vm.date.add(1, 'months');
            vm.selectNone();
            getTransactions();
        };

        vm.hasNextMonth = function() {
            var now = moment();
            return vm.date.month() >= now.month() && vm.date.year() >= now.year();
        };

        vm.sortByQuantity = function() {
            vm.transactions.transactions = _.sortBy(vm.transactions.transactions, function(transaction) {
                return parseFloat(transaction['debit_amount']) || parseFloat(transaction['credit_amount']);
            }).reverse();
        };

        vm.sortByDate = function() {
            vm.transactions.transactions = _.sortBy(vm.transactions.transactions, function(transaction) {
                return moment(transaction['transaction_date']);
            }).reverse();
        };

        vm.toggleCategorySelection = function(category) {
            vm.selectedCategories[category] = !vm.selectedCategories[category];
            vm.transactions.transactions.filter(function(transaction) {
                return transaction.category.indexOf(category) > -1;
            }).map(function(transaction) {
                transaction.selected = vm.selectedCategories[category];
                vm.updateSelectedTransaction(transaction);
            });
        };

        vm.toggleCategoryShown = function(categoryId) {
            vm.shownCategories[categoryId] = !vm.shownCategories[categoryId];
        };

        vm.addCategory = function (show) {
            for (var i in vm.shownCategories) {
                if (vm.shownCategories.hasOwnProperty(i)) {
                    vm.shownCategories[i] = show;
                }
            }
        };

        vm.isCategoryHidden = function(categories) {
            var isHidden = false;
            angular.forEach(categories, function(categoryId) {
                if (vm.shownCategories[categoryId] === false) {
                    isHidden = true;
                }
            });
            return isHidden;
        };

        vm.selectNone = function() {
            vm.restoreSelectedTransactions();
            for (var i in vm.selectedCategories) {
                if (vm.selectedCategories.hasOwnProperty(i)) {
                    vm.selectedCategories[i] = false;
                }
            }
            angular.forEach(vm.transactions.transactions, function(transaction) {
                transaction.selected = false;
            });
        };

        vm.selectAll = function() {
            vm.restoreSelectedTransactions();
            for (var i in vm.selectedCategories) {
                if (vm.selectedCategories.hasOwnProperty(i)) {
                    vm.selectedCategories[i] = true;
                }
            }
            angular.forEach(vm.transactions.transactions, function(transaction) {
                transaction.selected = true;
                vm.updateSelectedTransaction(transaction);
            });
        };

        vm.ignoreTransactions = function() {
            var ids = getSelectedIds();
            dataservice.ignoreTransactions(ids)
                .then(function () {
                    getTransactions();
                });
        };

        vm.undoIgnoreTransactions = function() {
            var ids = getSelectedIds();
            dataservice.undoIgnoreTransactions(ids)
                .then(function () {
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
            if (transaction['debit_amount']) {
                var selectedExpenses = parseFloat(vm.selectedExpenses);
                if (transaction.selected) {
                    selectedExpenses = selectedExpenses + parseFloat(transaction['debit_amount']);
                } else {
                    selectedExpenses = selectedExpenses - parseFloat(transaction['debit_amount']);
                }
                vm.selectedExpenses = selectedExpenses.toFixed(2);
            } else {
                var selectedIncomes = parseFloat(vm.selectedIncomes);
                if (transaction.selected) {
                    selectedIncomes = selectedIncomes + parseFloat(transaction['credit_amount']);
                } else {
                    selectedIncomes = selectedIncomes - parseFloat(transaction['credit_amount']);
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
                .then(function() {
                    getTransactions();
                });
        };

        vm.deleteCategory = function(categoryId) {
            // TODO: use a proper dialog
            if (window.confirm("You sure?")) {
                dataservice.deleteCategory(categoryId).then(function() {
                    vm.categories = vm.categories.reduce(function (acc, category) {
                        if (category.id !== categoryId) {
                            acc.push(category);
                        }
                        return acc;
                    }, []);
                });
            }
        };

        $scope.$on('category-created', function(evt, args) {
            vm.categories.push(args['category']);
        });

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