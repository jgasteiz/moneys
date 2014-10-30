/* recommended */

// dataservice factory
angular
    .module('moneys')
    .factory('dataservice', dataservice);

dataservice.$inject = ['$http', 'logger'];

function dataservice($http, logger) {

    return {
        getTransactions: getTransactions,
        ignoreTransactions: ignoreTransactions,
        undoIgnoreTransactions: undoIgnoreTransactions
    };

    function ignoreTransactions(ids, cb) {
        return $http({
            method: 'POST',
            url: '/api/transactions/',
            data: {action: 'ignore', ids: ids}
        }).error(function(data) {
            logger.error(data);
        });
    }

    function undoIgnoreTransactions(ids, cb) {
        return $http({
            method: 'POST',
            url: '/api/transactions/',
            data: {action: 'unignore', ids: ids}
        }).error(function(data) {
            logger.error(data);
        });
    }

    function getTransactions(query) {

        return $http.get('/api/transactions/', {params: query})
            .then(getTransactionsComplete)
            .catch(getTransactionsFailed);

        function getTransactionsComplete(response) {

            var transactions = {};

            transactions.transactions = response.data.results;

            transactions.totalTransactions = transactions.transactions.filter(function(expense) {
                return expense.debit_amount && !expense.ignored;
            }).reduce(function(acc, expense) {
                acc = acc + parseFloat(expense.debit_amount);
                return acc;
            }, 0).toFixed(2);

            transactions.totalIncomes = transactions.transactions.filter(function(expense) {
                return expense.credit_amount && !expense.ignored;
            }).reduce(function(acc, expense) {
                acc = acc + parseFloat(expense.credit_amount);
                return acc;
            }, 0).toFixed(2);

            transactions.balance = (transactions.totalIncomes - transactions.totalTransactions).toFixed(2);

            return transactions;
        }

        function getTransactionsFailed(error) {
            logger.error('XHR Failed for getTransactions.' + error.data);
        }
    }
}