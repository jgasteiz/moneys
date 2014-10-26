(function() {
    'use strict';

    angular
        .module('moneys')
        .directive('formElement', formElement);

    function formElement() {
        var directive = {
            link: link,
            scope: {
                'formElement': '='
            },
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, ngModel) {
            scope.formElement = element.get(0);
        }
    }
})();