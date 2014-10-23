/*global moneys */
(function() {
    'use strict';

    var expenseCollection = new moneys.collections.ExpenseCollection();

    var expenseCollectionView = new moneys.views.ExpenseCollectionView({
        el: '#expense-list',
        collection: expenseCollection
    });
})();