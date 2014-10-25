/* recommended */

// dataservice factory
angular
    .module('moneys')
    .factory('dataservice', dataservice);

dataservice.$inject = ['$http', 'logger'];

function dataservice($http, logger) {

    return {
        getExpenses: getExpenses
    };

    function getExpenses(query) {

        return $http.get('/api/expenses/', {params: query})
            .then(getExpensesComplete)
            .catch(getExpensesFailed);

        function getExpensesComplete(response) {

            var expenses = {};

            expenses.expenses = response.data.results;

            expenses.totalExpenses = _.reduce(expenses.expenses, function(memo, expense) {
                if (expense['debit_amount']) {
                    return memo + parseFloat(expense['debit_amount']);
                } else {
                    return memo;
                }
            }, 0).toFixed(2);
            expenses.totalIncomes = _.reduce(expenses.expenses, function(memo, expense) {
                if (expense['credit_amount']) {
                    return memo + parseFloat(expense['credit_amount']);
                } else {
                    return memo;
                }
            }, 0).toFixed(2);

            expenses.balance = (expenses.totalIncomes - expenses.totalExpenses).toFixed(2);

            return expenses;
        }

        function getExpensesFailed(error) {
            logger.error('XHR Failed for getExpenses.' + error.data);
        }
    }
}