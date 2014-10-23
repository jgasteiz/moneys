/*global moneys */
(function() {
    'use strict';

    /**
     * Expense model.
     */
    moneys.views.ExpenseCollectionView = Backbone.View.extend({
        events: {
            "click .next-page": "nextPage",
            "click .previous-page": "previousPage"
        },
        template: _.template($('#tpl-expense-collection').html()),
        page: 1,
        
        initialize: function() {
            this.listenTo(this.collection, 'reset add change remove', this.render, this);
            this.fetchCollection();
        },
        nextPage: function() {
            this.page = this.collection.page + 1;
            this.fetchCollection();
        },
        previousPage: function() {
            this.page = this.collection.page - 1;
            this.fetchCollection();
        },
        fetchCollection: function() {
            this.collection.fetch({
                data: {
                    page: this.page
                }
            });
        },
        render: function() {
            this.page = this.collection.page;
            this.$el.html(this.template({
                page: this.collection.page,
                hasNextPage: this.collection.hasNextPage,
                hasPreviousPage: this.collection.hasPreviousPage,
                expenses: this.collection.toJSON()
            }));
        }
    });

})();