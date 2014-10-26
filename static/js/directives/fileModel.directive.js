(function() {
    'use strict';

    angular
        .module('moneys')
        .directive('fileModel', fileModel);

    function fileModel() {
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

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