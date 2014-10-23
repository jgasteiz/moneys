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
        paginateBy: 20,
        
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
                    page: this.page,
                    paginate_by: this.paginateBy
                }
            });
        },
        generateChart: function(data) {
            c3.generate({
                bindto: this.el,
                data: {
                    columns: [
                        data
                    ],
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5
                    }
                }
            });
        },
        render: function() {
            this.page = this.collection.page;

            var expenses = _.map(this.collection.models, function(expense) {
                if (expense.has('debit_amount')) {
                    return parseFloat(expense.get('debit_amount'));
                } else {
                    return 0;
                }
            });

            // TODO: uncomment when generateChart makes sense.
            // this.generateChart(['Debit expenses'].concat(expenses));

            this.$el.html(this.template({
                page: this.collection.page,
                hasNextPage: this.collection.hasNextPage,
                hasPreviousPage: this.collection.hasPreviousPage,
                expenses: this.collection.toJSON()
            }));
        }
    });

})();