(function() {
    'use strict';

    angular
        .module('moneys')
        .directive('fileModel', fileModel);

    function fileModel() {
        return {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };

        function link(scope, element, attrs, ngModel) {
            ngModel.$render = function () {
                ngModel.$setViewValue(element.val());
            };

            element.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
        }
    }
})();