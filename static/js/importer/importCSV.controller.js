(function() {
    'use strict';

    angular
        .module('moneys')
        .controller('ImportCSVController', ImportCSVController);

    ImportCSVController.$inject = ['$scope', '$location', 'logger', '$http']

    function ImportCSVController($scope, $location, logger, $http) {

        var vm = this;

        vm.http = $http;
        vm.formElement = null;

        vm.submit = function(form) {

            form.$setSubmitted();
            if (form.$invalid) {
                return;
            }

            vm.http({
                method: 'POST',
                url: '/import_csv/',
                cache: false,
                data: new FormData(vm.formElement),
                transformRequest: false,
                headers: {'Content-Type': undefined}
            }).success(function(data) {
                $location.path('/');
            }).error(function(data) {
                logger.error(data);
            });

        };

    }
})();