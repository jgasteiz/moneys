/*global moneys */
(function() {
    'use strict';

    /**
     * Expense model.
     */
    moneys.views.ExpenseCollectionView = Backbone.View.extend({
        events: {
            "click .next-month": "nextMonth",
            "click .previous-month": "previousMonth"
        },
        template: _.template($('#tpl-expense-collection').html()),
        date: moment(),
        
        initialize: function() {
            this.listenTo(this.collection, 'reset add change remove', this.render, this);
            this.fetchCollection();
            // this.render();
        },
        nextMonth: function() {
            this.date = this.date.add(1, 'months');
            this.fetchCollection();
        },
        previousMonth: function() {
            this.date = this.date.subtract(1, 'months');
            this.fetchCollection();
        },
        fetchCollection: function() {
            this.collection.fetch({
                data: {
                    date: this.date.format('YYYY-MM')
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

            // var expenses = _.map(this.collection.models, function(expense) {
            //     if (expense.has('debit_amount')) {
            //         return parseFloat(expense.get('debit_amount'));
            //     } else {
            //         return 0;
            //     }
            // });

            // TODO: uncomment when generateChart makes sense.
            // this.generateChart(['Debit expenses'].concat(expenses));
            
            var expenses = _.reduce(this.collection.models, function(memo, expense) {
                if (expense.has('debit_amount')) {
                    return memo + parseFloat(expense.get('debit_amount'));
                } else {
                    return memo;
                }
            }, 0);

            var incomes = _.reduce(this.collection.models, function(memo, expense) {
                if (expense.has('credit_amount')) {
                    return memo + parseFloat(expense.get('credit_amount'));
                } else {
                    return memo;
                }
            }, 0);

            _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0);

            this.$el.html(this.template({
                expenseList: this.collection.toJSON(),
                date: this.date.format("MMMM YYYY"),
                hasNextMonth: this.date.month() < moment().month(),
                expenses: expenses.toFixed(2),
                incomes: incomes.toFixed(2),
                balance: (incomes - expenses).toFixed(2)
            }));
        }
    });

})();