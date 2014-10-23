/*global moneys */
(function() {
    'use strict';

    /**
     * Expense model.
     */
    moneys.views.ExpenseCollectionView = Backbone.View.extend({
        template: _.template($('#tpl-expense-collection').html()),
        initialize: function() {

        },
        render: function() {
            this.$el.html(this.template({expenses: this.collection.toJSON()}));
        }
    });

})();