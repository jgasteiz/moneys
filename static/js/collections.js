/*global moneys */
(function() {
    'use strict';

    /**
     * Expense collection.
     */
    moneys.collections.ExpenseCollection = Backbone.Collection.extend({
    	model: moneys.models.Expense,
    	url: '/api/expenses/',
    	
    	parse: function(response) {
    		this.page = parseInt(response.page, 10);
    		this.hasNextPage = response.has_next;
    		this.hasPreviousPage = response.has_previous;
    		return response.results;
    	}
    });

})();