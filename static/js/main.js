/*global moneys */
(function() {
    'use strict';

    moneys.expenses = new Backbone.Collection();

    // Create expenses
    for (var i = 0; i < moneys.expensesJson.length; i++) {
        var expense = new moneys.models.Expense(moneys.expensesJson[i].fields);
        moneys.expenses.add(expense);
    }

    var collectionView = new moneys.views.ExpenseCollectionView({
        el: '#expense-list',
        collection: moneys.expenses
    });

    collectionView.render();
})();