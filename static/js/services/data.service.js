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

            expenses.totalExpenses = expenses.expenses.filter(function(expense) {
                return expense.debit_amount && !expense.ignored;
            }).reduce(function(acc, expense) {
                acc = acc + parseFloat(expense.debit_amount);
                return acc;
            }, 0).toFixed(2);

            expenses.totalIncomes = expenses.expenses.filter(function(expense) {
                return expense.credit_amount && !expense.ignored;
            }).reduce(function(acc, expense) {
                acc = acc + parseFloat(expense.credit_amount);
                return acc;
            }, 0).toFixed(2);

            expenses.balance = (expenses.totalIncomes - expenses.totalExpenses).toFixed(2);

            return expenses;
        }

        function getExpensesFailed(error) {
            logger.error('XHR Failed for getExpenses.' + error.data);
        }
    }
}