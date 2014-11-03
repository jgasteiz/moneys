(function() {
    'use strict';

    angular
        .module('moneys')
        .directive('newCategory', newCategory);

    function newCategory() {
        var directive = {
            scope: {
                'formElement': '='
            },
            restrict: 'E',
            templateUrl: '/static/js/directives/newCategory.html',
            controller : NewCategoryController,
            controllerAs: 'vm'
        };
        return directive;

        NewCategoryController.$inject = ['$rootScope', 'dataservice'];

        function NewCategoryController($rootScope, dataservice) {
            var vm = this;

            vm.categoryName = '';
            vm.editMode = false;
            vm.createCategory = function() {
                if (vm.categoryName !== '') {
                    dataservice.addCategory(vm.categoryName)
                        .then(function(response) {
                            $rootScope.$broadcast('category-created', {
                                category: response.data
                            });
                            vm.cancel();
                        });
                }
            };
            vm.cancel = function() {
                vm.categoryName = '';
                vm.editMode = false;
            };
        }
    }
})();